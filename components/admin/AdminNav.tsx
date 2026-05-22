"use client";

import {
  FileTextIcon,
  HomeIcon,
  InfoIcon,
  LogOutIcon,
  MousePointerClickIcon,
  SearchIcon,
  ShieldIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/hero", label: "Hero", icon: HomeIcon },
  { href: "/admin/about", label: "Sobre", icon: InfoIcon },
  { href: "/admin/talents", label: "Talentos", icon: UsersIcon },
  { href: "/admin/partners", label: "Parceiros", icon: SparklesIcon },
  { href: "/admin/cta", label: "CTA", icon: MousePointerClickIcon },
  { href: "/admin/seo", label: "SEO", icon: SearchIcon },
  { href: "/admin/scripts", label: "Scripts", icon: FileTextIcon },
  { href: "/admin/users", label: "Usuários", icon: ShieldIcon },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  userEmail: string;
  userName?: string;
};

export function AppSidebar({ userEmail, userName, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const initials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "GF";
  const displayName = userName || "Admin";

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Logo */}
      <SidebarHeader className="p-4">
        <Link
          href="/admin/hero"
          className="group-data-[collapsible=icon]:hidden block"
        >
          <Image
            src="/LogoGrupoFarol--dark.svg"
            alt="Grupo Farol"
            width={160}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <nav className="flex flex-col gap-0.5 px-3 py-2 group-data-[collapsible=icon]:px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg text-sm transition-all duration-150",
                  "group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
                  isActive
                    ? "border-l-2 border-primary bg-[#1c1c1c] pl-[10px] pr-3 py-2 text-white group-data-[collapsible=icon]:border-l-0 group-data-[collapsible=icon]:bg-[#1c1c1c]"
                    : "px-3 py-2 text-[#666] hover:bg-[#161616] hover:text-[#999]",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

      {/* Footer — user row */}
      <SidebarFooter className="border-t border-[#222] p-0">
        <div className="flex items-center gap-2.5 px-3 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Avatar className="size-8 shrink-0 rounded-full">
            <AvatarFallback className="rounded-full bg-[#222] text-xs text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="grid min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-[13px] font-medium text-white">
              {displayName}
            </span>
            <span className="truncate text-[11px] text-[#555]">{userEmail}</span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            aria-label="Sair"
            className="shrink-0 rounded-md p-1.5 text-[#555] transition-all duration-150 hover:bg-[#222] hover:text-white disabled:opacity-50 group-data-[collapsible=icon]:hidden"
          >
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
