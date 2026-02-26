"use client";
import "./dashboardClient.css";

import {
  formatDate,
  getRegionCurrentDate,
  getRegionDate,
  getWeekEndDate,
  getWeekNumber,
  getWeekStartDate,
} from "@/lib/utils/date";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import TableRanking from "./TableRanking";
import Statistics from "./Statistics";

type Props = {
  session: Session;
  users: {
    _id: string;
    name: string;
    profilePicture: string;
    isWinner: boolean;
    workoutSessions: {
      photoUrl: string;
      timestamp: Date;
    }[];
  }[];
};

export default function DashboardClient({ session, users }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [sharePhoto, setSharePhoto] = useState(null);
  const router = useRouter();

  const today = getRegionCurrentDate();
  const weekNumber = getWeekNumber(today);
  const weekStart = formatDate(getWeekStartDate(today));
  const weekEnd = formatDate(getWeekEndDate(today));

  const myData = users.find((user) => user._id === session?.user?.id);

  const [activeTab, setActiveTab] = useState<"ranking" | "stats">("ranking");

  users.forEach((user) => {
    user.workoutSessions.forEach((session) => {
      session.timestamp = getRegionDate(session.timestamp);
    });
  });

  const isWorkoutRegisteredToday = myData?.workoutSessions.some((workout) => {
    return formatDate(new Date(workout.timestamp)) === formatDate(today);
  });

  const registerWorkout = () => {
    if (isLoading) return;
    inputRef.current?.click();
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);

    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/workout-sessions`, {
      method: "POST",
      body: formData,
    });

    const newWorkoutSession = await response.json();

    setSharePhoto(newWorkoutSession.photoUrl);

    setIsLoading(false);

    const today = getRegionCurrentDate();
    const week = getWeekNumber(today);
    const weekStart = formatDate(getWeekStartDate(today));
    const message = `*Semana ${week} (${weekStart}):*\n${users
      .map((user) => {
        let numberOfSessions = user.workoutSessions?.length;
        if (user._id === myData?._id) {
          numberOfSessions++;
        }

        return `- ${user.name} +${numberOfSessions}${user.isWinner ? " 👑" : ""}`;
      })
      .join("\n")}\n`;
    setShareMessage(message);
    router.refresh();
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      const shareData: ShareData = {
        title: "🔥Entrenado!🔥",
        text: shareMessage,
        url: "https://gymbros-beta.vercel.app",
      };

      if (sharePhoto) {
        const res = await fetch(sharePhoto);
        const blob = await res.blob();

        const file = new File([blob], "entrenando.png", {
          type: blob.type,
        });

        shareData.files = [file];
      }

      navigator.share(shareData);
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
      window.open(url, "_blank");
    }

    setTimeout(() => {
      setShareMessage("");
    }, 5000);
  };

  return (
    <>
      <div className="flex flex-col gap-10 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="mt-10 justify-items-center items-center gap-5 flex flex-col">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Gymbros 🏋️‍♂️
          </h1>
        </div>
        <div className="w-full max-w-md flex bg-zinc-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("ranking")}
            className={`flex-1 py-2 rounded-lg text-center transition ${
              activeTab === "ranking" ? "bg-white text-black" : "text-zinc-300"
            }`}
          >
            Ranking
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-2 rounded-lg text-center transition ${
              activeTab === "stats" ? "bg-white text-black" : "text-zinc-300"
            }`}
          >
            Stats
          </button>
        </div>
        <div>
          {activeTab === "ranking" && (
            <div className="justify-items-center items-center gap-5 flex flex-col">
              <h3 className="text-xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Semana {weekNumber} ({weekStart} - {weekEnd})
              </h3>
              <TableRanking users={users} />
            </div>
          )}
          {activeTab === "stats" && <Statistics />}
        </div>

        {!isWorkoutRegisteredToday && (
          <>
            {" "}
            <div
              className="relative mb-10 inline-block rounded-full p-[2px]
                            bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-blue-500 to-purple-500
                            animate-rainbow shadow-[0_0_20px_rgba(255,0,255,0.4)]"
            >
              <button
                className="flex h-12 items-center justify-center
                  rounded-full bg-white/90 backdrop-blur-md
                  dark:bg-black/80
                  px-6 text-sm font-medium
                  transition-all duration-300
                  hover:scale-[1.03]
                  cursor-pointer"
                onClick={registerWorkout}
              >
                {isLoading ? "Procesando..." : "Registrar entreno 💪"}
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhoto}
            />
          </>
        )}
      </div>
      {shareMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-black">
              Compartir Ranking 📈
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Comparte el leaderboard con tus bros.
            </p>

            <div className="flex gap-2 mt-4">
              <button
                className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                onClick={share}
              >
                Compartir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

