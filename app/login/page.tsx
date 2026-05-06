import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="admin-theme flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 text-foreground md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center justify-center self-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LogoGrupoFarol.svg"
            alt="Grupo Farol"
            className="h-12 w-auto"
          />
        </a>
        <LoginForm />
      </div>
    </main>
  );
}
