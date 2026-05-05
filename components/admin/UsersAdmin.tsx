"use client";

import { useState, useTransition } from "react";
import type { User } from "@supabase/supabase-js";
import { MailPlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { deleteUserAction, inviteUserAction } from "@/app/admin/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type UsersAdminProps = {
  users: User[];
  allowedDomains: string[];
};

export function UsersAdmin({ users: initialUsers, allowedDomains }: UsersAdminProps) {
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function getDomain(value: string) {
    return value.split("@")[1]?.toLowerCase() ?? "";
  }

  function validateEmail(value: string) {
    const domain = getDomain(value);
    return allowedDomains.includes(domain);
  }

  function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError(`Use um domínio permitido: ${allowedDomains.join(", ")}`);
      return;
    }

    startTransition(async () => {
      try {
        await inviteUserAction(email);
        toast.success("Convite enviado.");
        setEmail("");
      } catch (inviteError) {
        toast.error(
          inviteError instanceof Error ? inviteError.message : "Erro ao convidar.",
        );
      }
    });
  }

  function handleDelete(userId: string) {
    startTransition(async () => {
      try {
        await deleteUserAction(userId);
        setUsers((current) => current.filter((user) => user.id !== userId));
        toast.success("Usuário removido.");
      } catch (deleteError) {
        toast.error(
          deleteError instanceof Error ? deleteError.message : "Erro ao remover.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Convidar usuário</CardTitle>
          <CardDescription>
            Domínios permitidos: {allowedDomains.join(", ")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite}>
            <FieldGroup>
              {error ? (
                <Alert variant="destructive">
                  <AlertTitle>Email inválido</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <Field data-invalid={Boolean(error)}>
                <FieldLabel htmlFor="invite-email">Email</FieldLabel>
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  required
                />
                {error ? <FieldError>{error}</FieldError> : null}
              </Field>
              <Button type="submit" disabled={isPending}>
                <MailPlusIcon data-icon="inline-start" />
                Convidar
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Administradores cadastrados.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">{user.id}</p>
              </div>
              <Button
                type="button"
                variant="destructive"
                disabled={isPending}
                onClick={() => handleDelete(user.id)}
              >
                <Trash2Icon data-icon="inline-start" />
                Remover
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
