"use client";

import { getWeekDay } from "@/lib/utils/date.util";
import SessionPhoto from "./SessionPhoto";
import "./tableRanking.css";

type Props = {
  user: {
    _id: string;
    name: string;
    profilePicture: string;
    isWinner: boolean;
    workoutSessions: {
      photoUrl: string;
      timestamp: Date;
    }[];
  };
};

export default function BroCard({ user }: Props) {
  const getDaysList = (
    workoutSessions: { photoUrl: string; timestamp: Date }[],
  ) => {
    const days = ["L", "M", "M", "J", "V", "S", "D"];

    return days.map((day, index) => {
      const hasTrained = workoutSessions.some(
        (session: { photoUrl: string; timestamp: Date }) =>
          getWeekDay(session.timestamp) === index + 1,
      );

      return {
        day,
        hasTrained,
      };
    });
  };

  return (
    <div
      className="
        flex items-center justify-between
        bg-zinc-900/80 backdrop-blur-sm
        rounded-2xl px-5 py-4
        shadow-md border border-zinc-800
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden">
          <SessionPhoto
            photoUrl={user.workoutSessions[0]?.photoUrl}
            isWinner={user?.isWinner}
            timestamp={
              user.workoutSessions[0]?.timestamp
                ? new Date(user.workoutSessions[0].timestamp)
                : null
            }
          />
        </div>  
        <div>
          <div className="flex items-center gap-2">
            <img
              src={user?.profilePicture || "/profile-placeholder.png"}
              alt="profile pic"
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="text-lg font-semibold text-yellow-400">{user.name}</p>
          </div>

          <div className="flex gap-2 mt-2">
            {getDaysList(user.workoutSessions)?.map((date, i) => (
              <span
                key={i}
                className={`
                  w-7 h-7 flex items-center justify-center rounded-full text-xs
                  ${
                    date.hasTrained
                      ? "bg-yellow-400 text-black"
                      : "bg-zinc-700 text-zinc-400"
                  }
                `}
              >
                {date.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          {user.isWinner && <span className="text-yellow-400 text-xl">👑</span>}
          <span className="text-2xl font-bold text-yellow-400">
            +{user.workoutSessions?.length}
          </span>
        </div>
      </div>
    </div>
  );
}
