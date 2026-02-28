"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function HomeClient() {
  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-xs md:max-w-sm">
        <Image
          src="/assets/images/logo.png"
          alt="App logo"
          width={500}
          height={100}
          className="w-full h-auto"
        />
      </div>
      <button
        onClick={() => signIn("google")}
        className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Ingresar con Google
      </button>
    </div>
  );
}

