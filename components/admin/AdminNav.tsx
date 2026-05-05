"use client";

import { useState } from "react";
import {
  FileImageIcon,
  FileTextIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MousePointerClickIcon,
  SearchIcon,
  ShieldIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/hero", label: "Hero", icon: HomeIcon },
  { href: "/admin/talents", label: "Talentos", icon: UsersIcon },
  { href: "/admin/partners", label: "Partners", icon: SparklesIcon },
  { href: "/admin/images", label: "Imagens", icon: FileImageIcon },
  { href: "/admin/cta", label: "CTA", icon: MousePointerClickIcon },
  { href: "/admin/seo", label: "SEO", icon: SearchIcon },
  { href: "/admin/scripts", label: "Scripts", icon: FileTextIcon },
  { href: "/admin/users", label: "Users", icon: ShieldIcon },
];

type AdminNavProps = {
  userEmail: string;
};

export function AdminNav({ userEmail }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const navList = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              isActive && "bg-muted text-foreground",
            )}
          >
            <Icon data-icon="inline-start" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-auto flex flex-col gap-3 border-t pt-4">
      <div className="min-w-0 px-3">
        <p className="truncate text-sm font-medium">
          {userEmail || "Carregando..."}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="w-full"
      >
        <LogOutIcon data-icon="inline-start" />
        {isSigningOut ? "Saindo..." : "Sair"}
      </Button>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r bg-background p-4 md:flex">
        <Link href="/admin/hero" className="mb-6 px-3 font-heading text-lg">
          Grupo Farol
        </Link>
        {navList}
        {footer}
      </aside>

      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
        <Link href="/admin/hero" className="font-heading text-base">
          Grupo Farol
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <Button type="button" variant="ghost" size="icon">
                <MenuIcon />
                <span className="sr-only">Abrir navegação</span>
              </Button>
            }
          />
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Grupo Farol</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4">
              {navList}
              {footer}
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
