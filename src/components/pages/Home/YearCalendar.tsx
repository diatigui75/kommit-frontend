import { LoaderCircleIcon } from 'lucide-react'
import { standupContent } from '@/data/standup'
import type { CalendarView } from '@/logic/standup/calendar/calendar'

type YearCalendarProps = {
  view: CalendarView
  onSelectDay: (jour: string) => void
}

const { calendar } = standupContent
const SQUARE = 'size-[11px] shrink-0 rounded-[2px]'
const FILLED = 'border border-success bg-success-bg'

// Calendrier de l'année (maquette F2) : gris sans standup, liseré vert cliquable avec (CA12, CA14), futur vide (CA13).
export default function YearCalendar({ view, onSelectDay }: YearCalendarProps) {
  return (
    <section className="flex w-full max-w-[880px] flex-col gap-4 rounded-lg border border-card-border bg-white p-6 shadow-card">
      {view.status === 'loading' && (
        <div className="flex justify-center py-8" role="status" aria-label={calendar.loadingLabel}>
          <LoaderCircleIcon className="size-6 animate-spin text-primary" aria-hidden />
        </div>
      )}
      {view.status === 'error' && (
        <p role="alert" className="py-8 text-center text-sm text-danger">
          {calendar.errorMessage}
        </p>
      )}
      {view.status === 'ready' && (
        <>
          <h2 className="text-lg leading-7 font-bold text-foreground">
            {view.count}
            {calendar.countSuffix}
          </h2>
          <div className="overflow-x-auto">
            <div className="flex min-w-[640px] flex-col gap-1">
              <div className="relative h-4 text-[11px] leading-4 text-grey-text">
                {view.months.map((month) => (
                  <span
                    key={`${month.label}-${month.weekIndex}`}
                    className="absolute"
                    style={{ left: `calc(40px + ${month.weekIndex} * 14px)` }}
                  >
                    {month.label}
                  </span>
                ))}
              </div>
              {calendar.dayLabels.map((dayLabel, dayIndex) => (
                <div key={dayIndex} className="flex items-center gap-[3px]">
                  <span className="w-[37px] text-[11px] leading-3 text-grey-text">{dayLabel}</span>
                  {view.weeks.map((week, weekIndex) => {
                    const day = week[dayIndex]
                    if (!day || day.state === 'future') return <span key={weekIndex} className={SQUARE} />
                    if (day.state === 'empty') return <span key={weekIndex} className={`${SQUARE} bg-day-empty`} />
                    return (
                      <button
                        key={weekIndex}
                        type="button"
                        aria-label={`${calendar.dayButtonPrefix}${day.label}`}
                        onClick={() => onSelectDay(day.jour)}
                        className={`${SQUARE} ${FILLED} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 text-[11px] leading-4 text-grey-text">
            <span className="flex items-center gap-1.5">
              <span className={`${SQUARE} bg-day-empty`} />
              {calendar.emptyLegend}
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`${SQUARE} ${FILLED}`} />
              {calendar.filledLegend}
            </span>
          </div>
        </>
      )}
    </section>
  )
}
