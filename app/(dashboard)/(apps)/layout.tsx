import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { getViewerServer } from "@/lib/auth/viewer.server";
import { redirect } from "next/navigation";

export default async function AppsLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = await getViewerServer();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <NavBar />
        <main className="relative flex flex-col w-full min-h-screen min-w-0">
          <div className="mx-auto w-full">
            <Header email={user.email ?? "-"} role={role} />
          </div>
          <div className="mx-auto w-full flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
