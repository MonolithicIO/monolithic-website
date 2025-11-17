import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@core/components/ui/card";
import { Badge } from "@core//components/ui/badge";
import { Clock } from "lucide-react";

type LastUpdatedStatusProps = {
  timestamp?: string | Date | null;
};

export default function ServiceStatusUpdatedAt({ timestamp }: LastUpdatedStatusProps) {
  const formatted = React.useMemo(() => {
    if (!timestamp) return "—";
    const d = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  }, [timestamp]);

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 opacity-80" />
          Last Updated
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge className="px-3 py-1 text-xs rounded-full" variant="default">
          {formatted}
        </Badge>
      </CardContent>
    </Card>
  );
}
