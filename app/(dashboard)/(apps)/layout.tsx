import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";

export default async function AppsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ici user est forcément là car le parent layout a déjà redirect si pas user
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("user_id", user!.id)
    .single();

  const role = profile?.role ?? "USER";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <NavBar />
      <main className="flex flex-col w-full min-h-screen shadow-sm min-w-0">
        <Header email={user!.email ?? "-"} role={role} />
        <div className="p-4 flex-1 min-w-0 bg-white">{children}</div>
      </main>
    </div>
  );
}
