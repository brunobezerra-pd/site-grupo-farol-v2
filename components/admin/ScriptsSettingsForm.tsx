"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { saveSettingAction } from "@/app/admin/actions";
import { ScriptsWarning } from "@/components/admin/ScriptsWarning";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type ScriptsSettingsFormProps = {
  initialSettings: Record<string, string>;
};

const fields = [
  { key: "script_head", label: "Code in <head>" },
  { key: "script_body", label: "Code in <body>" },
  { key: "script_footer", label: "Footer ad code" },
];

export function ScriptsSettingsForm({
  initialSettings,
}: ScriptsSettingsFormProps) {
  const [values, setValues] = useState(initialSettings);
  const [pendingKey, setPendingKey] = useState("");
  const [isPending, startTransition] = useTransition();

  function saveField(key: string) {
    setPendingKey(key);

    startTransition(async () => {
      try {
        await saveSettingAction(key, values[key] ?? "");
        toast.success("Script salvo.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <ScriptsWarning />
      <Card>
        <CardHeader>
          <CardTitle>Scripts</CardTitle>
          <CardDescription>
            Salve cada área separadamente para evitar sobrescritas acidentais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {fields.map((field) => (
              <Field key={field.key}>
                <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                <Textarea
                  id={field.key}
                  value={values[field.key] ?? ""}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  className="min-h-36 font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending && pendingKey === field.key}
                  onClick={() => saveField(field.key)}
                >
                  {isPending && pendingKey === field.key
                    ? "Salvando..."
                    : "Salvar"}
                </Button>
              </Field>
            ))}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
