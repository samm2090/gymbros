"use client";

import { signIn } from "next-auth/react";

export default function HomeClient() {
  return (
    <div className="flex flex-col gap-10 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Gymbros 🏋️‍♂️
      </h1>
      <button
        onClick={() => signIn("google")}
        className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Ingresar con Google
      </button>
    </div>
  );
}

