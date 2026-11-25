type PageHeadingProps = {
  title: string
  titleAccent: string
  subtitle: string
}

export default function PageHeading({ title, titleAccent, subtitle }: PageHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-7 text-center">
      <h1 className="text-3xl leading-tight font-bold text-foreground md:text-5xl md:leading-[57.6px]">
        {title}
        <span className="text-blue-accent">{titleAccent}</span>
      </h1>
      <p className="max-w-[544px] text-lg leading-7 text-grey-blue">{subtitle}</p>
    </div>
  )
}
