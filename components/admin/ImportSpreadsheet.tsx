"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { createTalentAction, importTalentPhoto } from "@/app/admin/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TalentInsert } from "@/types";

// System fields the user must/can map
type SystemField = {
  key: string;
  label: string;
  required: boolean;
  hint?: string;
};

const SYSTEM_FIELDS: SystemField[] = [
  { key: "name", label: "Name", required: true },
  { key: "categories", label: "Categories", required: true, hint: "Comma-separated" },
  { key: "photo_url", label: "Photo URL", required: false },
  { key: "description", label: "Description", required: false },
  { key: "instagram_url", label: "Instagram URL", required: false },
  { key: "tiktok_url", label: "TikTok URL", required: false },
  { key: "followers_range", label: "Followers Range", required: false },
  { key: "location", label: "Location", required: false },
  { key: "gender", label: "Gender", required: false },
];

const NONE_VALUE = "__none__";

type ColumnMapping = Record<string, string>; // systemFieldKey -> spreadsheetColumn

type ImportLog = {
  name: string;
  status: string;
  isError?: boolean;
};

type Step = "upload" | "mapping" | "importing" | "done";

export function ImportSpreadsheet() {
  const [step, setStep] = useState<Step>("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // ─── Parse file (xlsx or csv) ───────────────────────────────────────────────

  async function parseFile(file: File): Promise<Record<string, string>[]> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
      defval: "",
      raw: false,
    });
  }

  // ─── Step 1: Upload ──────────────────────────────────────────────────────────

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setSummary("");
    setLogs([]);
    setProgress(0);

    startTransition(async () => {
      try {
        const parsed = await parseFile(file);
        if (parsed.length === 0) {
          setError("The file appears to be empty or could not be read.");
          return;
        }

        const detectedHeaders = Object.keys(parsed[0]);
        setHeaders(detectedHeaders);
        setRows(parsed);

        // Auto-map columns whose header matches a system field key exactly (case-insensitive)
        const autoMapping: ColumnMapping = {};
        for (const field of SYSTEM_FIELDS) {
          const match = detectedHeaders.find(
            (h) => h.trim().toLowerCase() === field.key.toLowerCase(),
          );
          if (match) autoMapping[field.key] = match;
        }
        setMapping(autoMapping);
        setStep("mapping");
      } catch {
        setError("Could not read the file. Make sure it is a valid .xlsx or .csv file.");
      }
    });

    event.target.value = "";
  }

  // ─── Step 2: Mapping ─────────────────────────────────────────────────────────

  function handleMappingChange(systemKey: string, spreadsheetColumn: string | null) {
    setMapping((current) => ({
      ...current,
      [systemKey]:
        !spreadsheetColumn || spreadsheetColumn === NONE_VALUE ? "" : spreadsheetColumn,
    }));
  }

  function getMappingErrors(): string[] {
    return SYSTEM_FIELDS.filter(
      (f) => f.required && !mapping[f.key],
    ).map((f) => f.label);
  }

  // ─── Step 3: Import ──────────────────────────────────────────────────────────

  function handleImport() {
    const missingRequired = getMappingErrors();
    if (missingRequired.length > 0) {
      setError(`Please map the following required fields: ${missingRequired.join(", ")}`);
      return;
    }

    setError("");
    setStep("importing");

    startTransition(async () => {
      let successCount = 0;
      let pendingPhotoCount = 0;
      const newLogs: ImportLog[] = [];

      for (const [index, row] of rows.entries()) {
        const name = String(row[mapping["name"]] ?? "").trim();
        if (!name) continue;

        const rawPhotoUrl = mapping["photo_url"]
          ? String(row[mapping["photo_url"]] ?? "").trim()
          : "";

        const uploadedPhotoUrl = rawPhotoUrl
          ? await importTalentPhoto(rawPhotoUrl, name)
          : null;

        const photoPending = Boolean(rawPhotoUrl) && !uploadedPhotoUrl;

        const categoriesRaw = mapping["categories"]
          ? String(row[mapping["categories"]] ?? "")
          : "";

        const payload: TalentInsert = {
          name,
          photo_url: uploadedPhotoUrl ?? rawPhotoUrl,
          photo_pending: photoPending,
          categories: categoriesRaw
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          description: mapping["description"]
            ? String(row[mapping["description"]] ?? "")
            : "",
          instagram_url: mapping["instagram_url"]
            ? String(row[mapping["instagram_url"]] ?? "")
            : "",
          tiktok_url: mapping["tiktok_url"]
            ? String(row[mapping["tiktok_url"]] ?? "")
            : "",
          followers_range: mapping["followers_range"]
            ? String(row[mapping["followers_range"]] ?? "")
            : "",
          location: mapping["location"]
            ? String(row[mapping["location"]] ?? "")
            : "",
          gender: mapping["gender"]
            ? String(row[mapping["gender"]] ?? "")
            : "",
          featured: false,
        };

        await createTalentAction(payload);
        successCount += 1;

        if (photoPending) {
          pendingPhotoCount += 1;
          newLogs.push({
            name,
            isError: true,
            status: `Image could not be downloaded. Open the Google Drive link → Share → "Anyone with the link".`,
          });
        } else {
          newLogs.push({ name, status: "Imported successfully." });
        }

        setProgress(Math.round(((index + 1) / rows.length) * 100));
        setLogs([...newLogs]);
      }

      setSummary(
        `${successCount} talent${successCount !== 1 ? "s" : ""} imported` +
        (pendingPhotoCount > 0
          ? `, ${pendingPhotoCount} with pending photo`
          : " successfully"),
      );
      setStep("done");
      toast.success("Import complete.");
    });
  }

  // ─── Reset ───────────────────────────────────────────────────────────────────

  function handleReset() {
    setStep("upload");
    setHeaders([]);
    setRows([]);
    setMapping({});
    setProgress(0);
    setLogs([]);
    setSummary("");
    setError("");
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import spreadsheet</CardTitle>
        <CardDescription>
          Upload a .xlsx or .csv file. You will map the columns to the system fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Cannot proceed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* ── Step 1: Upload ── */}
          {step === "upload" && (
            <Field>
              <FieldLabel htmlFor="spreadsheet">File (.xlsx or .csv)</FieldLabel>
              <Input
                id="spreadsheet"
                type="file"
                accept=".xlsx,.csv"
                disabled={isPending}
                onChange={handleFileChange}
              />
            </Field>
          )}

          {/* ── Step 2: Mapping ── */}
          {step === "mapping" && (
            <>
              <p className="text-sm text-muted-foreground">
                {rows.length} rows detected. Map each system field to a column from your
                file. Required fields are marked with *.
              </p>

              <div className="grid gap-3">
                {SYSTEM_FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className="grid grid-cols-2 items-center gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {field.label}
                        {field.required && (
                          <span className="ml-1 text-destructive">*</span>
                        )}
                      </p>
                      {field.hint && (
                        <p className="text-xs text-muted-foreground">{field.hint}</p>
                      )}
                    </div>
                    <Select
                      value={mapping[field.key] || NONE_VALUE}
                      onValueChange={(value) =>
                        handleMappingChange(field.key, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select column..." />
                      </SelectTrigger>
                      <SelectContent>
                        {!field.required && (
                          <SelectItem value={NONE_VALUE}>
                            — Not mapped —
                          </SelectItem>
                        )}
                        {headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isPending}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleImport}
                  disabled={isPending || getMappingErrors().length > 0}
                >
                  Import {rows.length} rows
                </Button>
              </div>
            </>
          )}

          {/* ── Step 3: Importing ── */}
          {(step === "importing" || step === "done") && (
            <>
              <Progress value={progress}>
                <ProgressLabel>Progress</ProgressLabel>
                <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                  {progress}%
                </span>
              </Progress>

              {summary && (
                <p className="text-sm font-medium">{summary}</p>
              )}

              {logs.length > 0 && (
                <div className="max-h-72 overflow-auto rounded-lg border p-3 space-y-1">
                  {logs.map((log, i) => (
                    <p
                      key={i}
                      className={`text-sm ${log.isError ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      <span className="font-medium text-foreground">{log.name}:</span>{" "}
                      {log.status}
                    </p>
                  ))}
                </div>
              )}

              {step === "done" && (
                <Button type="button" variant="outline" onClick={handleReset}>
                  Import another file
                </Button>
              )}
            </>
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
