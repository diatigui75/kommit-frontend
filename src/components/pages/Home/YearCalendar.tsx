import { useEffect, useRef } from 'react'
import { cn } from 'cn'
import { dailyContent } from '@/data/daily'
import { calendarGrid } from '@/logic/daily/calendarGrid/calendarGrid'
import type { Jour } from '@/types/apiContract'

type YearCalendarProps = {
  today: Jour
  count: number
  recordedJours: Jour[]
  onOpenDay: (jour: Jour) => void
}

// Calendrier des 53 dernières semaines. Une case enregistrée est cerclée de vert et ouvre son résumé.
export default function YearCalendar({ today, count, recordedJours, onOpenDay }: YearCalendarProps) {
  const { weeks, months } = calendarGrid(today, recordedJours)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sur petit écran, la grille défile : on l'ouvre sur les semaines récentes.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [])

  return (
    <section className="w-full max-w-[600px] rounded-lg border border-card-border bg-white p-4 shadow-card">
      <h2 className="text-sm leading-5 font-bold text-foreground">
        {count}
        {dailyContent.calendar.titleEnd}
      </h2>
      <div ref={scrollRef} className="mt-4 overflow-x-auto">
        <div className="grid w-max grid-cols-[auto_repeat(53,8px)] gap-[2px] text-[8px] leading-[8px] text-grey-blue">
          <span />
          {weeks.map((_, week) => {
            const month = months.find((marker) => marker.week === week)
            return (
              <span key={week} className="overflow-visible whitespace-nowrap">
                {month ? dailyContent.calendar.monthLabels[month.monthIndex] : ''}
              </span>
            )
          })}
          {dailyContent.calendar.dayLabels.map((dayLabel, weekday) => (
            <div key={weekday} className="contents">
              <span className="pr-2">{dayLabel}</span>
              {weeks.map((days, week) => {
                const day = days[weekday]
                if (!day) return <span key={week} />
                if (!day.isRecorded) return <span key={week} className="size-2 rounded-[1px] bg-day-empty" />
                return (
                  <button
                    key={week}
                    type="button"
                    aria-label={`${dailyContent.calendar.openDayLabel}${day.jour}`}
                    onClick={() => onOpenDay(day.jour)}
                    className="size-2 cursor-pointer rounded-[1px] border border-success bg-success-bg"
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-4 text-[9px] text-grey-blue">
        <LegendItem className="bg-day-empty">{dailyContent.calendar.legendEmpty}</LegendItem>
        <LegendItem className="border border-success bg-success-bg">{dailyContent.calendar.legendRecorded}</LegendItem>
      </div>
    </section>
  )
}

function LegendItem({ className, children }: { className: string; children: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('size-2 rounded-[1px]', className)} />
      {children}
    </span>
  )
}
