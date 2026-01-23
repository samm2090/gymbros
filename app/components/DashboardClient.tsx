"use client";

import {
  formatDate,
  getWeekEndDate,
  getWeekNumber,
  getWeekStartDate,
} from "@/lib/utils/date";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import TableRanking from "./TableRanking";

type Props = {
  session: Session;
  users: [];
};

export default function DashboardClient({ session, users }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const today = new Date();
  const weekNumber = getWeekNumber(today);
  const weekStart = formatDate(getWeekStartDate(today));
  const weekEnd = formatDate(getWeekEndDate(today));

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    const res = await fetch(`/api/workout-sessions`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setIsLoading(false);

    if (result.success) {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Gymbros, Hola {session.user?.name}
      </h1>

      <div className="justify-items-center gap-5 flex flex-col">
        <h3 className="text-xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Semana {weekNumber} ({weekStart} - {weekEnd})
        </h3>
        <TableRanking users={users}></TableRanking>
      </div>

      <button
        className="flex h-12 items-center 
        justify-center rounded-full border 
        border-solid border-black/[.08] 
        px-5 transition-colors hover:border-transparent 
        hover:bg-black/[.04] dark:border-white/[.145] 
        dark:hover:bg-[#1a1a1a] cursor-pointer"
        onClick={() => {
          if (isLoading) return;
          inputRef.current?.click();
        }}
      >
        {isLoading ? "Procesando..." : "Registrar entreno 💪"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhoto}
      />
      <button
        className="flex h-10 items-center 
        justify-center rounded-full border 
        border-solid border-black/[.08] 
        px-5 transition-colors hover:border-transparent 
        hover:bg-black/[.04] dark:border-white/[.145] 
        dark:hover:bg-[#1a1a1a] cursor-pointer text-xs"
        onClick={() => signOut()}
      >
        Salir
      </button>
    </div>
  );
}

