import { standupContent } from '@/data/standup'

type YearCalendarProps = {
  count: number
  // Une colonne par semaine, 7 jours chacune (lundi en premier) : true = daily enregistré.
  weeks: boolean[][]
}

const { calendar } = standupContent

// Calendrier de l'année sous la carte de saisie (maquette F2) : un carré vert par daily enregistré.
export default function YearCalendar({ count, weeks }: YearCalendarProps) {
  return (
    <section className="flex w-full max-w-[880px] flex-col gap-4 rounded-lg border border-card-border bg-white p-6 shadow-card">
      <h2 className="text-lg leading-7 font-bold text-foreground">
        {count}
        {calendar.countSuffix}
      </h2>
      <div className="overflow-x-auto">
        <div className="flex min-w-[640px] flex-col gap-1">
          <div className="flex justify-between pl-10 text-[11px] leading-4 text-grey-text">
            {calendar.months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
          {calendar.dayLabels.map((dayLabel, dayIndex) => (
            <div key={dayIndex} className="flex items-center gap-[3px]">
              <span className="w-[37px] text-[11px] leading-3 text-grey-text">{dayLabel}</span>
              {weeks.map((week, weekIndex) => (
                <span
                  key={weekIndex}
                  className={
                    week[dayIndex]
                      ? 'size-[11px] shrink-0 rounded-[2px] border border-success bg-success-bg'
                      : 'size-[11px] shrink-0 rounded-[2px] bg-day-empty'
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 text-[11px] leading-4 text-grey-text">
        <span className="flex items-center gap-1.5">
          <span className="size-[11px] rounded-[2px] bg-day-empty" />
          {calendar.emptyLegend}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-[11px] rounded-[2px] border border-success bg-success-bg" />
          {calendar.filledLegend}
        </span>
      </div>
    </section>
  )
}
