"use client";

import {
  formatDate,
  getRegionCurrentDate,
  getRegionDate,
} from "@/lib/utils/date.util";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";

type Workout = {
  timestamp: Date;
  photoUrl: string;
};

export default function MyCalendar() {
  const [data, setData] = useState<Workout[]>([]);
  const [lastMonths, setLastMonths] = useState<
    { date: Date; monthName: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/my-workout-sessions");
        const workouts = await res.json();

        workouts.forEach(
          (item: { timestamp: Date }) =>
            (item.timestamp = getRegionDate(item.timestamp)),
        );

        let currentDate = DateTime.fromJSDate(getRegionCurrentDate());
        const firstDate = DateTime.fromJSDate(
          workouts[workouts.length - 1]?.timestamp,
        ).toFormat("MMyyyy");

        const months = [];

        if (workouts?.length) {
          while (true) {
            months.push({
              date: currentDate.startOf("month").toJSDate(),
              monthName: currentDate.monthLong || "",
            });

            if (currentDate.toFormat("MMyyyy") === firstDate) {
              break;
            }

            currentDate = currentDate.minus({ month: 1 });
          }
        }

        setLastMonths(months);

        setData(workouts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {lastMonths.map((month, index) => {
        return (
          <>
            <div key={index} className="flex flex-col gap-2">
              <h3 className="font-semibold mt-10">
                {month.monthName?.toUpperCase()}
              </h3>
              <div>
                <Calendar
                  value={month.date}
                  view="month"
                  showNavigation={false}
                  showNeighboringMonth={false}
                  tileContent={({ date }) =>
                    data
                      .map((d) => formatDate(d.timestamp))
                      .includes(formatDate(date)) ? (
                      <span role="img" aria-label="gym">
                        💪
                      </span>
                    ) : null
                  }
                  onClickDay={(date) => {
                    const found = data.find(
                      (d) => formatDate(d.timestamp) === formatDate(date),
                    );

                    if (found?.photoUrl) {
                      window.open(found.photoUrl, "_blank");
                    }
                  }}
                  calendarType="gregory"
                />
              </div>
            </div>
          </>
        );
      })}
    </>
  );
}
