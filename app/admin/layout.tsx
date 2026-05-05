"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? "");
    });
  }, [pathname]);

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav userEmail={userEmail} />
      <main className="px-4 py-6 md:pl-64 md:pr-6">{children}</main>
    </div>
  );
}
