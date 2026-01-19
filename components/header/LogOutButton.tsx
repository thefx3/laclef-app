"use client";

import { supabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace("/login");
        router.refresh();
    }

    return (
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md bg-black text-white text-sm font-semibold hover:bg-gray-800 cursor-pointer"
        >
          Déconnexion
        </button>
      );
}