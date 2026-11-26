// Briques communes aux 15 écrans de F2, reconstruites sans le MCP Figma.
// Règle de lecture des valeurs :
// - sans marque : valeur copiée telle quelle d'un brut de F1 (header, footer, titre, boutons, champs, couleurs) ;
// - marquée « ~ » dans un commentaire : valeur estimée depuis les captures de F2 (échelle capture -> frame ≈ 1,93), à confirmer dans Figma.
// Icônes : nom Lucide en data-name ; seuls le logo et log-out existent en fichier (assets-bruts/, copiés de F1).

const imgImage13 = "../assets-bruts/23718.png";
const imgLucideLogOut = "../assets-bruts/0a4e9.svg";

// ---------- Header, titre, footer : repris de F1 (F1-13) ----------

export function Logo() {
  return (
    <div className="content-stretch flex gap-[3px] items-center justify-center leading-[0] relative shrink-0" data-name="Logo">
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="kommit icon">
        <div className="bg-[var(--white,white)] col-1 h-[19.516px] ml-[7.08px] mt-[4.34px] relative row-1 w-[20.479px]" />
        <div className="col-1 h-[28.671px] ml-0 mt-0 relative row-1 w-[35.128px]" data-name="image 13">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage13} />
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-bold justify-center not-italic relative shrink-0 text-[#0f172a] text-[20px] tracking-[-0.5px] whitespace-nowrap">
        <p className="leading-[28px]">Kommit</p>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.8)] content-stretch flex items-center justify-between px-[24px] py-[20px] relative shrink-0 w-[1280px]" data-name="Header - Top Navigation Bar">
      <Logo />
      <div className="content-stretch flex items-center relative shrink-0" data-name="SignIn / SignOut buttons">
        <div className="bg-white content-stretch flex gap-[8px] items-center justify-center overflow-clip pl-[16px] pr-[12px] py-[12px] relative rounded-[8px] shrink-0" data-name="Primary Button / Tertiary">
          <div className="relative shrink-0 size-[24px]" data-name="lucide/log-out">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLucideLogOut} />
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[color:var(--grey-blue,#475569)] text-center whitespace-nowrap">
            <p className="leading-[24px]">Se déconnecter</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// before = texte noir, name = partie en bleu, subtitle = sous-titre.
export function Title({ before, name, subtitle }) {
  return (
    <div className="content-stretch flex flex-col items-center px-[200px] py-[32px] relative shrink-0 w-full" data-name="Title">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-center justify-center leading-[0] not-italic py-[28px] relative shrink-0 text-center w-full">
        <div className="flex flex-col font-['Inter:Bold'] font-bold justify-center relative shrink-0 text-[#141c25] text-[0px] whitespace-nowrap">
          <p className="text-[48px]">
            <span className="leading-[57.6px]">{before}</span>
            <span className="leading-[57.6px] text-[#0763cf]">{name}</span>
          </p>
        </div>
        <div className="flex flex-col font-['Inter:Regular'] font-normal justify-center relative shrink-0 text-[18px] text-[color:var(--grey-blue,#475569)]">
          <p className="leading-[28px]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <div className="content-stretch flex flex-col items-center justify-end px-[156px] py-[40px] relative shrink-0 w-[1280px]" data-name="Footer - Bottom Action Bar (Mobile Only)">
      <div className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal gap-[3px] items-center justify-center leading-[0] not-italic relative shrink-0 text-[#424753] text-[14px] text-center w-full whitespace-nowrap">
        <div className="flex flex-col justify-center relative shrink-0">
          <p>
            <span className="leading-[20px]">{`Créé par `}</span>
            <a className="cursor-pointer font-['Inter:Bold'] font-bold leading-[20px]" href="https://www.youtube.com/@videv9858" target="_blank">ViDev</a>
            <span className="leading-[20px]">{` ©`}</span>
          </p>
        </div>
        <div className="flex flex-col justify-center relative shrink-0">
          <p className="leading-[20px]">2026 Kommit. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}

// ---------- Carte de saisie du daily ----------

// state : "Default" | "Hover" | "Pressed". Bouton primaire en dégradé de F1 ; survol = opacity-80 comme F1-02.
export function LaunchButton({ state = "Default" }) {
  return (
    <div className={`bg-gradient-to-r border border-[#0051ae] border-solid content-stretch flex from-[#0051ae] gap-[8px] items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[4px] shrink-0 to-[#0969da] ${state === "Default" ? "" : "opacity-80"}`} data-name="Primary Button / Lancer le daily">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Lancer le daily</p>
      </div>
      <div className="relative shrink-0 size-[20px] text-white" data-name="lucide/send" />
      {/* ~ taille de l'icône */}
    </div>
  );
}

// Note penchée en haut à droite de la carte, visible seulement quand la zone de texte est vide.
// ~ toutes les valeurs : position, taille, rotation, couleurs.
export function TipNote() {
  return (
    <div className="absolute bg-[#eef4fd] border border-[#c9dbf4] border-solid content-stretch flex flex-col gap-[4px] items-start p-[12px] right-[-48px] rotate-[3deg] rounded-[4px] shadow-[0px_12px_16px_rgba(20,28,37,0.04)] top-[-48px] w-[192px]" data-name="Astuce">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <div className="relative shrink-0 size-[14px] text-[#0051ae]" data-name="lucide/info" />
        <p className="font-['Inter:Regular'] font-semibold leading-[16px] text-[#0051ae] text-[10px] tracking-[1px] uppercase">Astuce</p>
      </div>
      <p className="font-['Inter:Regular'] font-normal leading-[16px] text-[#424753] text-[12px]">Garde tes daily courts pour une meilleure vue d'ensemble en fin de semaine</p>
    </div>
  );
}

// text vide = placeholder + note Astuce ; text rempli = note masquée.
export function DailyInputCard({ text = "", buttonState = "Default" }) {
  return (
    <div className="bg-white border border-[rgba(194,198,214,0.15)] border-solid content-stretch drop-shadow-[0px_12px_16px_rgba(20,28,37,0.04)] flex flex-col gap-[16px] items-end p-[32px] relative rounded-[8px] shrink-0 w-[880px]" data-name="Daily Input Card">
      {/* ~ padding, gap ; largeur 880 = 1280 - 2 × 200 du Title de F1 */}
      {text === "" && <TipNote />}
      <div className="border-[#dae3ef] border-b border-solid h-[150px] relative shrink-0 w-full" data-name="Textarea">
        {/* ~ hauteur */}
        <p className={`font-['Inter:Regular'] font-normal leading-[24px] text-[16px] ${text === "" ? "text-[color:var(--grey-light-placeholder,rgba(114,119,133,0.5))]" : "text-[#141c25]"}`}>
          {text === "" ? "Renseigne tes progrès, tes éventuels blocages et ce que tu vas faire …" : text}
        </p>
      </div>
      <LaunchButton state={buttonState} />
    </div>
  );
}

// ---------- Calendrier annuel ----------

const MONTHS = ["juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", "janv.", "févr.", "mars", "avr.", "mai"];
const WEEKS = 53;

// filled = liste de [semaine, jour] (jour 0 = lundi) des daily enregistrés.
export function YearCalendar({ count = 0, filled = [] }) {
  const isFilled = (w, d) => filled.some(([fw, fd]) => fw === w && fd === d);
  return (
    <div className="bg-white border border-[rgba(194,198,214,0.15)] border-solid content-stretch drop-shadow-[0px_12px_16px_rgba(20,28,37,0.04)] flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] shrink-0 w-[880px]" data-name="Year Calendar">
      {/* ~ padding, gap */}
      <p className="font-['Inter:Bold'] font-bold leading-[28px] text-[#141c25] text-[18px]">{`${count} daily renseigné(s) sur l'année`}</p>
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Grid">
        <div className="content-stretch flex justify-between pl-[40px] relative shrink-0 w-full">
          {MONTHS.map((m) => (
            <p key={m} className="font-['Inter:Regular'] font-normal leading-[16px] text-[#424753] text-[11px]">{m}</p>
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
          <div key={d} className="content-stretch flex gap-[3px] items-center relative shrink-0 w-full">
            {/* ~ taille des cases et gap */}
            <p className="font-['Inter:Regular'] font-normal leading-[12px] text-[#424753] text-[11px] w-[37px]">{d === 0 ? "Lun" : d === 2 ? "Mer" : d === 4 ? "Ven" : ""}</p>
            {Array.from({ length: WEEKS }, (_, w) => (
              <div key={w} className={`rounded-[2px] shrink-0 size-[11px] ${isFilled(w, d) ? "bg-[#e0faeb] border border-[#066a31] border-solid" : "bg-[#eef1f6]"}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Legend">
        <div className="flex gap-[6px] items-center">
          <div className="bg-[#eef1f6] rounded-[2px] size-[11px]" />
          <p className="font-['Inter:Regular'] leading-[16px] text-[#424753] text-[11px]">Daily non renseigné</p>
        </div>
        <div className="flex gap-[6px] items-center">
          <div className="bg-[#e0faeb] border border-[#066a31] border-solid rounded-[2px] size-[11px]" />
          <p className="font-['Inter:Regular'] leading-[16px] text-[#424753] text-[11px]">Daily enregistré</p>
        </div>
      </div>
      {/* vert de « Daily enregistré » = fond et bordure du toast de succès de F1-07 */}
    </div>
  );
}

// ---------- Page d'accueil complète ----------

export function HomePage({ alreadyFilled = false, text = "", buttonState = "Default", children }) {
  return (
    <div className="bg-[#f7f9ff] content-stretch flex flex-col items-center relative size-full" data-name="Desktop - Daily">
      <Header />
      {alreadyFilled ? (
        <Title before="Ton daily du jour est déjà renseigné, " name="Marc !" subtitle="En renseignant ton daily du jour à nouveau, il remplacera l'existant." />
      ) : (
        <Title before="Quoi de neuf aujourd'hui, " name="Marc ?" subtitle="Renseigne ton daily du jour ci-dessous." />
      )}
      <div className="content-stretch flex flex-col gap-[48px] items-center relative shrink-0 w-full">
        {/* ~ gap */}
        <DailyInputCard text={text} buttonState={buttonState} />
        <YearCalendar count={alreadyFilled ? 1 : 0} filled={alreadyFilled ? [[50, 2]] : []} />
      </div>
      <div className="flex-[1_0_0] min-h-px relative w-full" />
      <Footer />
      {children}
    </div>
  );
}

// ---------- Fenêtres par-dessus la page ----------

// ~ couleur et flou du voile
export function Overlay({ children }) {
  return (
    <div className="absolute backdrop-blur-[2px] bg-[rgba(20,28,37,0.4)] content-stretch flex inset-0 items-center justify-center" data-name="Overlay">
      {children}
    </div>
  );
}

// status : "live" (Live Sync Active, vert de F1-07) ou une date « En date du … ».
export function ChatHeader({ status = "live", closeState = "Default" }) {
  return (
    <div className="border-[#dae3ef] border-b border-solid content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-name="Chat Header">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
        <div className="bg-gradient-to-r content-stretch flex from-[#0051ae] items-center justify-center rounded-[8px] size-[40px] to-[#0969da]" data-name="Avatar">
          <div className="size-[22px] text-white" data-name="lucide/bot" />
        </div>
        <div className="content-stretch flex flex-col items-start">
          <p className="font-['Inter:Bold'] font-bold leading-[24px] text-[#141c25] text-[16px]">Daily Standup Assistant</p>
          {status === "live" ? (
            <div className="flex gap-[4px] items-center">
              <div className="bg-[#066a31] rounded-full size-[6px]" />
              <p className="font-['Inter:Regular'] font-medium leading-[16px] text-[#066a31] text-[11px]">Live Sync Active</p>
            </div>
          ) : (
            <div className="flex gap-[4px] items-center">
              <div className="size-[12px] text-[rgba(66,71,83,0.6)]" data-name="lucide/clock" />
              <p className="font-['Inter:Regular'] font-medium leading-[16px] text-[rgba(66,71,83,0.6)] text-[11px]">{status}</p>
            </div>
          )}
        </div>
      </div>
      <div className={`size-[24px] ${closeState === "Hover" ? "text-[#141c25]" : "text-[color:var(--grey-blue,#475569)]"}`} data-name="lucide/x" />
    </div>
  );
}

export function UserMessage({ children }) {
  return (
    <div className="bg-gradient-to-r from-[#0051ae] max-w-[440px] px-[20px] py-[12px] rounded-[12px] rounded-br-[4px] self-end to-[#0969da]" data-name="User Message">
      <p className="font-['Inter:Regular'] font-normal leading-[20px] text-[14px] text-white">{children}</p>
    </div>
  );
}

// ~ fond bleu pâle de la bulle
export function AssistantMessage({ children }) {
  return (
    <div className="bg-[#edf3fc] content-stretch flex flex-col gap-[12px] max-w-[440px] px-[20px] py-[12px] rounded-[12px] rounded-bl-[4px] self-start" data-name="Assistant Message">
      {children}
    </div>
  );
}

export function AssistantText({ children }) {
  return <p className="font-['Inter:Regular'] font-normal leading-[20px] text-[#141c25] text-[14px]">{children}</p>;
}

export function QuickReplies({ options }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center self-start" data-name="Quick Replies">
      {options.map((o) => (
        <div key={o} className="bg-white border border-[#dae3ef] border-solid px-[12px] py-[6px] rounded-[8px]">
          <p className="font-['Inter:Regular'] font-medium leading-[16px] text-[#0051ae] text-[12px] whitespace-nowrap">{o}</p>
        </div>
      ))}
    </div>
  );
}

export const SUMMARY = {
  hier: ["Migration de l'authentification vers la nouvelle API terminée", "Problèmes de persistance des cookies JWT en production résolus"],
  blocages: ["Aucun"],
  aVenir: ["Déploiement des mises à jour en DEV", "Vérification du flux d'authentification en DEV"],
};
export const SUMMARY_UPDATED = { ...SUMMARY, aVenir: [...SUMMARY.aVenir, "Updater le favico avec le nouveau logo"] };

export function SummaryBlock({ summary = SUMMARY }) {
  const sections = [["Hier", summary.hier], ["Blocages", summary.blocages], ["À venir", summary.aVenir]];
  return (
    <div className="bg-white border border-[#dae3ef] border-solid content-stretch flex flex-col gap-[12px] p-[16px] rounded-[8px] w-full" data-name="Summary">
      {sections.map(([label, items]) => (
        <div key={label} className="flex flex-col gap-[4px]">
          <p className="font-['Inter:Bold'] font-bold leading-[16px] text-[#0051ae] text-[10px] tracking-[1px] uppercase">{label}</p>
          <ul className="list-disc pl-[20px]">
            {items.map((i) => (
              <li key={i} className="font-['Inter:Regular'] leading-[20px] text-[#141c25] text-[14px]">{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Champ du bas, fond et bordure des inputs de F1.
export function ChatInput({ value = "" }) {
  return (
    <div className="border-[#dae3ef] border-t border-solid content-stretch flex px-[24px] py-[16px] relative shrink-0 w-full" data-name="Chat Input">
      <div className="bg-[#f7f9ff] border-[#dae3ef] border-b-2 border-l border-r border-solid border-t content-stretch flex flex-1 h-[43px] items-center justify-between px-[12px] rounded-[4px]">
        <p className={`font-['Inter:Regular'] leading-[normal] text-[14px] ${value === "" ? "text-[color:var(--grey-light-placeholder,rgba(114,119,133,0.5))]" : "text-[#141c25]"}`}>
          {value === "" ? "Écrire un message …" : value}
        </p>
        <div className="size-[20px] text-[#0051ae]" data-name="lucide/send" />
      </div>
    </div>
  );
}

// ~ largeur 672 et hauteur max de la fenêtre
export function ChatWindow({ children, input = "", closeState = "Default", status = "live", showInput = true }) {
  return (
    <div className="bg-white content-stretch flex flex-col max-h-[920px] overflow-clip relative rounded-[12px] shadow-[0px_12px_16px_rgba(20,28,37,0.04)] w-[672px]" data-name="Daily Standup Assistant">
      <ChatHeader status={status} closeState={closeState} />
      <div className="content-stretch flex flex-1 flex-col gap-[16px] overflow-y-auto px-[24px] py-[24px]" data-name="Messages">
        {children}
      </div>
      {showInput && <ChatInput value={input} />}
    </div>
  );
}

// hovered : null | "continue" | "quit". Bouton « Poursuivre » = secondaire de F1 ; rouge = --red-warning de F1-05.
export function QuitDialog({ hovered = null }) {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[12px] items-center left-1/2 p-[32px] rounded-[12px] shadow-[0px_12px_16px_rgba(20,28,37,0.04)] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px]" data-name="Quit Dialog">
      {/* ~ largeur, padding */}
      <div className="absolute right-[16px] size-[20px] text-[color:var(--grey-blue,#475569)] top-[16px]" data-name="lucide/x" />
      <div className="size-[32px] text-[#0051ae]" data-name="lucide/circle-alert" />
      <p className="font-['Inter:Bold'] font-bold leading-[24px] text-[#141c25] text-[16px] text-center">Le daily standup n'est pas encore validé.</p>
      <p className="font-['Inter:Regular'] leading-[20px] text-[#424753] text-[14px] text-center">
        En quittant cette conversation,<br />tout l'échange sera définitivement perdu.<br />Es-tu sûr de vouloir quitter ?
      </p>
      <div className="content-stretch flex gap-[16px] items-center pt-[8px]">
        <div className={`border border-[#0051ae] border-solid px-[16px] py-[12px] rounded-[4px] ${hovered === "continue" ? "bg-[var(--blue-light-placeholder,#f7f9ff)]" : "bg-white"}`} data-name="Poursuivre le daily">
          <p className="font-['Inter:Regular'] font-semibold leading-[24px] text-[16px] text-[color:var(--blue-text,#055bbf)]">Poursuivre le daily</p>
        </div>
        <div className={`border border-[var(--red-warning,#ca3725)] border-solid flex gap-[8px] items-center px-[16px] py-[12px] rounded-[4px] ${hovered === "quit" ? "bg-[var(--red-warning,#ca3725)]" : "bg-white"}`} data-name="Quitter le daily">
          <p className={`font-['Inter:Regular'] font-semibold leading-[24px] text-[16px] ${hovered === "quit" ? "text-white" : "text-[color:var(--red-warning,#ca3725)]"}`}>Quitter le daily</p>
          <div className={`size-[20px] ${hovered === "quit" ? "text-white" : "text-[color:var(--red-warning,#ca3725)]"}`} data-name="lucide/door-open" />
        </div>
      </div>
    </div>
  );
}

// ---------- Conversations réutilisées par plusieurs écrans ----------

export const FIRST_MESSAGE =
  "J'ai terminé la migration de l'authentification vers la nouvelle API et résolu les problèmes relou de cookies JWT qu'on voyait en production. Prêt à pousser en DEV.";

export function ConversationUntilSummary() {
  return (
    <>
      <UserMessage>{FIRST_MESSAGE}</UserMessage>
      <AssistantMessage>
        <AssistantText>Excellent travail ! La migration de l'authentification était un gros morceau.<br />As-tu rencontré des blocages pour le déploiement en DEV ou je note qu'il reste du travail pour ce ticket CCE-12 ?</AssistantText>
      </AssistantMessage>
      <QuickReplies options={["Pas de blocage, RAS", "Non, je dois encore modifier des choses en DEV"]} />
      <UserMessage>Pas de blocage, RAS</UserMessage>
      <AssistantMessage>
        <AssistantText>Très bien, je note que tu n'as eu aucun blocage. Je sais déjà ce que tu vas faire aujourd'hui. Je suis prêt à résumer ton daily.</AssistantText>
      </AssistantMessage>
      <AssistantMessage>
        <AssistantText>Voici le résumé de ton daily. Tu valides ?</AssistantText>
        <SummaryBlock />
      </AssistantMessage>
    </>
  );
}

export const VALIDATE_OPTIONS = ["Oui, je valide le daily", "Non, j'aimerais ajouter une info."];
