import { layoutContent } from '@/data/layout'

const { footer } = layoutContent

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1280px] px-4 py-10 text-center text-sm leading-5 text-grey-text">
      <p>
        {footer.createdBy}{' '}
        <a href={footer.authorUrl} target="_blank" rel="noopener noreferrer" className="font-bold">
          {footer.author}
        </a>{' '}
        {footer.copyright}
      </p>
    </footer>
  )
}
