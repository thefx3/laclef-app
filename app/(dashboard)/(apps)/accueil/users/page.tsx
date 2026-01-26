import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import UsersClient from "@/components/accueil/users/UsersClient";
import type { UserProfileRow, UserRole } from "@/lib/users/types";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabaseAdmin
    .from("user_profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const rawRole = String(me?.role ?? "USER");
  const currentRole: UserRole =
    rawRole === "ADMIN" || rawRole === "SUPER_ADMIN" ? rawRole : "USER";

  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .select("user_id,email,first_name,last_name,role,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const users = (data ?? []) as UserProfileRow[];

  return (
    <PageShell>
      <PageHeader title="Utilisateurs" />
      <UsersClient
        initialUsers={users}
        currentRole={currentRole}
        currentUserId={user.id}
      />
    </PageShell>
  );
}
