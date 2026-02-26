"use client";

import { useEffect, useState } from "react";

type UserStats = {
  _id: string;
  name: string;
  totalWorkoutSessions: number;
};

export default function Statistics() {
  const [data, setData] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div>Total global</div>
      <div className="w-full max-w-md flex flex-col gap-3">
        {data &&
          data?.map((user, index) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-zinc-900 rounded-xl px-4 py-3 shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-zinc-400 w-6">
                  #{index + 1}
                </span>

                <span className="text-white font-medium">{user.name}</span>
              </div>

              <div className="text-right">
                <span className="text-xl font-bold text-green-400">
                  {user.totalWorkoutSessions}
                </span>
                <p className="text-xs text-zinc-400">Total</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
