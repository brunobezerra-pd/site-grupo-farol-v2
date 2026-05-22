"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AppSidebar } from "@/components/admin/AdminNav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";

const breadcrumbLabels: Record<string, string> = {
  hero: "Hero",
  about: "Sobre",
  talents: "Talentos",
  partners: "Parceiros",
  cta: "CTA",
  seo: "SEO",
  scripts: "Scripts",
  users: "Usuários",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? "");
      setUserName(
        data.user?.user_metadata?.full_name ??
          data.user?.user_metadata?.name ??
          "",
      );
    });
  }, [pathname]);

  if (pathname === "/admin/login") {
    return (
      <div className="admin-theme">
        {children}
        <Toaster richColors />
      </div>
    );
  }

  const segments = pathname.split("/").filter(Boolean);
  const section = segments[1];
  const subsection = segments[2];
  const sectionLabel = section ? (breadcrumbLabels[section] ?? section) : null;

  return (
    <div className="admin-theme">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar userEmail={userEmail} userName={userName} />
          <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 hidden data-[orientation=vertical]:block"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href="/admin/hero" />}>
                      Admin
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {sectionLabel && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {subsection ? (
                          <BreadcrumbLink
                            render={<Link href={`/admin/${section}`} />}
                          >
                            {sectionLabel}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{sectionLabel}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </>
                  )}
                  {subsection && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Editar</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <main className="flex flex-1 flex-col p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster richColors />
    </div>
  );
}
