import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { requireAdmin } from "@/lib/auth/viewer.server";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = await requireAdmin();

  return (
    <div className="h-screen">
      <div className="flex h-full flex-col lg:flex-row">
        <NavBar role={role} />
        <main className="relative flex min-h-0 w-full flex-col min-w-0">
          <div className="mx-auto w-full flex-1 overflow-y-auto">
            <div className="sticky top-0 z-30">
              <Header email={user.email ?? "-"} role={role} />
            </div>
            <div className="-mt-6 pt-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
