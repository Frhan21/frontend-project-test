import { Navigate, Outlet } from "react-router";

import { useSession } from "@/providers/session-provider";
import { Toaster } from "../ui/sonner";

export default function PublicLayout() {
  const { isAuthenticated } = useSession();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f3efe6_0%,#fffdf8_42%,#f3f7ff_100%)] text-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-12 px-6 py-8 lg:px-10">
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <Toaster/> 
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
