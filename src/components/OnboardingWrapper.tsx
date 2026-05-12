"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const isSetupPage = pathname === "/setup";
      const user = session.user as any;
      
      if (!user.onboardingComplete && !isSetupPage && !pathname.startsWith("/api")) {
        router.push("/setup");
      }
    }
  }, [session, status, pathname, router]);

  return <>{children}</>;
}
