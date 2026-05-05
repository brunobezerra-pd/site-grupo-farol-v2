import { TriangleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ScriptsWarning() {
  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>Atenção aos scripts</AlertTitle>
      <AlertDescription>
        Cole apenas códigos revisados. O conteúdo será salvo e renderizado
        exatamente como foi inserido.
      </AlertDescription>
    </Alert>
  );
}
