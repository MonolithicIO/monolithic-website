import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@core/components/ui/card";
import { Badge } from "@core/components/ui/badge";
import { Separator } from "@core/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent } from "@core/components/ui/tooltip";
import { Server, Database, Clock, Info } from "lucide-react";

export interface DatabaseHealthModel {
  isOnline: boolean;
  connectionsAvailable: string;
  openConnections: string;
  latency: string[];
  version?: string;
}

// Allow the `data` prop to be optional and provide sensible defaults so the
// component doesn't crash when `data` is undefined (common during initial
// render or if parent forgot to pass it).
type Props = {
  data?: Partial<DatabaseHealthModel> | null;
  /** Optional loading state to show placeholders */
  loading?: boolean;
};

const DEFAULT_DATA: DatabaseHealthModel = {
  isOnline: false,
  connectionsAvailable: "—",
  openConnections: "—",
  latency: [],
  version: undefined,
};

export default function DatabaseHealthCard({ data, loading = false }: Props) {
  // merge provided data with defaults to avoid accessing properties on undefined
  const merged: DatabaseHealthModel = { ...DEFAULT_DATA, ...(data ?? {}) } as DatabaseHealthModel;

  // compute status color based on real data
  const statusColor = merged.isOnline ? "bg-green-600/90 text-white" : "bg-red-600/90 text-white";

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-lg border border-gray-700">
      <CardHeader className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="text-sm md:text-base">Database Health</CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`px-3 py-1 rounded-full font-medium ${statusColor}`}>
            {loading ? "Loading..." : merged.isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          <Database className="w-4 h-4 opacity-80" />
          <div className="flex flex-col">
            <span className="text-xs">Postgre Status</span>
            <span className="text-sm font-medium">Version {loading ? "..." : (merged.version ?? "—")}</span>
          </div>
        </div>

        <Separator className="my-2" />

        <ul className="space-y-3">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 opacity-80" />
              <div>
                <p className="text-xs text-muted-foreground">Connections</p>
                <p className="font-medium">{loading ? "..." : merged.connectionsAvailable}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">open: {loading ? "..." : merged.openConnections}</div>
          </li>

          <li>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 opacity-80" />
              <div>
                <p className="text-xs text-muted-foreground">Latency</p>
                <div className="mt-1 flex gap-2">
                  {loading ? (
                    <span className="text-xs text-muted-foreground">...</span>
                  ) : merged.latency && merged.latency.length > 0 ? (
                    merged.latency.map((l, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted/40 font-medium">
                        {l} ms
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 opacity-80" />
              <div>
                <p className="text-xs text-muted-foreground">Details</p>
                <p className="text-sm">{merged.isOnline ? "Healthy" : "Unavailable"}</p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <button className="text-xs underline-offset-2 underline">More</button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Connections include pooled + active. Latency shows recent samples.</p>
              </TooltipContent>
            </Tooltip>
          </li>
        </ul>

        <div className="mt-4 flex items-center justify-end">
          <button className="text-xs px-3 py-1 rounded-lg border border-gray-700">Refresh</button>
        </div>
      </CardContent>
    </Card>
  );
}
