// Outils de /run-qa, lancés par `node .claude/skills/run-qa/qa.mjs <commande>`.
// Le fichier d'env QA est lu ici, jamais par Claude : le hook block-env lui en interdit l'accès.
//   check            vérifie le fichier d'env QA, affiche les liens (sans le secret de la base)
//   start            ouvre une session de QA : fige la liste des e2e existants, que le hook qa-guard protège
//   stop             ferme la session de QA
//   elapsed          minutes écoulées depuis le start
//   cleanup [--yes]  liste (ou supprime avec --yes) les comptes de test créés depuis le start
//   collect <json> <dossier-captures>
//                    lit le rapport JSON de Playwright, copie chaque capture sous un nom stable
//                    (test-results/ est vidé à chaque run) et affiche un résumé par test

import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ENV_FILE = '.env.qa'
const SESSION_FILE = '.claude/qa-session.json'
// Domaine des emails de test : e2e existants (marc+…@test.dev) et exploration (qa+…@test.dev).
const TEST_EMAIL_PATTERN = '%@test.dev'

const isLocal = (url) => /localhost|127\.0\.0\.1/.test(url ?? '')

function loadEnv() {
  if (!existsSync(ENV_FILE)) return false
  process.loadEnvFile(ENV_FILE)
  return true
}

function readSession() {
  if (!existsSync(SESSION_FILE)) {
    console.error('Aucune session de QA ouverte : lancer `start` d’abord.')
    process.exit(1)
  }
  return JSON.parse(readFileSync(SESSION_FILE, 'utf8'))
}

function check() {
  const hasEnvFile = loadEnv()
  const { QA_BASE_URL, VITE_API_URL, E2E_DATABASE_URL } = process.env
  const problems = []
  if (!hasEnvFile) problems.push(`${ENV_FILE} absent : le créer avec \`cp ${ENV_FILE}.example ${ENV_FILE}\`.`)
  if (hasEnvFile && !QA_BASE_URL) problems.push('QA_BASE_URL vide.')
  if (hasEnvFile && !VITE_API_URL) problems.push('VITE_API_URL vide.')
  if (hasEnvFile && !E2E_DATABASE_URL) problems.push('E2E_DATABASE_URL vide : SM-18 sera sauté et les comptes de test ne pourront pas être supprimés.')
  if (isLocal(QA_BASE_URL) || isLocal(VITE_API_URL)) problems.push('Un lien pointe sur localhost : le QA ne teste que les liens déployés.')
  console.log(JSON.stringify({ envFile: hasEnvFile, QA_BASE_URL, VITE_API_URL, hasDatabaseUrl: Boolean(E2E_DATABASE_URL), problems }, null, 2))
  process.exit(problems.some((p) => !p.startsWith('E2E_DATABASE_URL')) ? 1 : 0)
}

function start() {
  const protectedFiles = execSync('git ls-files e2e', { encoding: 'utf8' }).split('\n').filter(Boolean)
  const session = { startedAt: new Date().toISOString(), protectedFiles }
  writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2))
  console.log(JSON.stringify({ startedAt: session.startedAt, protectedFiles: protectedFiles.length }))
}

function stop() {
  rmSync(SESSION_FILE, { force: true })
  console.log('Session de QA fermée.')
}

function elapsed() {
  const { startedAt } = readSession()
  console.log(((Date.now() - Date.parse(startedAt)) / 60000).toFixed(1))
}

async function cleanup(confirmed) {
  const { startedAt } = readSession()
  loadEnv()
  if (!process.env.E2E_DATABASE_URL) {
    console.error('E2E_DATABASE_URL vide : suppression impossible.')
    process.exit(1)
  }
  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: process.env.E2E_DATABASE_URL })
  await client.connect()
  // createdAt est un timestamp sans fuseau, écrit en UTC par Prisma.
  const where = `email LIKE $1 AND "createdAt" >= ($2::timestamptz AT TIME ZONE 'UTC')`
  try {
    const { rows } = await client.query(`SELECT email FROM "user" WHERE ${where} ORDER BY "createdAt"`, [TEST_EMAIL_PATTERN, startedAt])
    if (!confirmed) {
      console.log(JSON.stringify({ toDelete: rows.length, emails: rows.map((r) => r.email) }, null, 2))
      return
    }
    // Les sessions et comptes liés partent avec l'utilisateur (ON DELETE CASCADE).
    const { rowCount } = await client.query(`DELETE FROM "user" WHERE ${where}`, [TEST_EMAIL_PATTERN, startedAt])
    console.log(JSON.stringify({ deleted: rowCount }))
  } finally {
    await client.end()
  }
}

const slug = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

function collect(jsonPath, capturesDir) {
  const report = JSON.parse(readFileSync(jsonPath, 'utf8'))
  mkdirSync(capturesDir, { recursive: true })
  const tests = []
  const walk = (suite) => {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests) {
        const last = test.results.at(-1) ?? {}
        const shot = (last.attachments ?? []).find((a) => a.name === 'screenshot' && a.path && existsSync(a.path))
        const capture = shot ? `P1-${slug(spec.file.replace(/\.test\.ts$/, ''))}-${slug(spec.title)}.png` : null
        if (shot) copyFileSync(shot.path, join(capturesDir, capture))
        tests.push({
          file: spec.file,
          title: spec.title,
          status: test.status === 'skipped' ? 'skipped' : spec.ok ? 'passed' : 'failed',
          durationMs: last.duration,
          error: last.error?.message?.split('\n')[0]?.replace(/\u001b\[[0-9;]*m/g, '') ?? null,
          capture,
        })
      }
    }
    for (const child of suite.suites ?? []) walk(child)
  }
  for (const suite of report.suites ?? []) walk(suite)
  const count = (s) => tests.filter((t) => t.status === s).length
  console.log(JSON.stringify({ passed: count('passed'), failed: count('failed'), skipped: count('skipped'), tests }, null, 2))
}

const [command, flag, extra] = process.argv.slice(2)
const commands = { check, start, stop, elapsed, cleanup: () => cleanup(flag === '--yes'), collect: () => collect(flag, extra) }
if (!commands[command]) {
  console.error(`Commande inconnue. Attendu : ${Object.keys(commands).join(', ')}.`)
  process.exit(1)
}
await commands[command]()
