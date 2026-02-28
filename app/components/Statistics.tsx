"use client";

import { getMonthsDiff } from "@/lib/utils/date.util";
import { useEffect, useState } from "react";

type UserStats = {
  _id: string;
  name: string;
  totalWorkoutSessions: number;
  firstWorkoutSessionDate: string;
};

export default function Statistics() {
  const [data, setData] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/workout-sessions");
        const json = await res.json();

        setData(json);
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
      <div className="w-full flex flex-col items-stretch gap-4">
        <h2 className="text-lg font-semibold text-white px-4">Total Global</h2>

        <div className="w-full flex flex-col gap-3 px-4">
          {(data ?? []).map((user, index) => (
            <div
              key={user._id}
              className="w-full flex items-center justify-between 
                   bg-zinc-900/80 backdrop-blur-sm 
                   rounded-2xl px-4 py-4
                   shadow-md border border-zinc-800"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-bold text-zinc-500 w-6">
                  #{index + 1}
                </span>

                <span className="text-white font-medium truncate">
                  {user.name}
                </span>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-xl font-bold text-green-400">
                  {user.totalWorkoutSessions}
                </span>
                <span className="text-xs text-zinc-500">
                  Total desde hace {" "}
                  {getMonthsDiff(user.firstWorkoutSessionDate, today)} meses
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
