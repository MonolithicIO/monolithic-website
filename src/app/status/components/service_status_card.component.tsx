import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@core/components/ui/card";
import { Badge } from "@core/components/ui/badge";
import { Separator } from "@core/components/ui/separator";
// import { Tooltip, TooltipTrigger, TooltipContent } from "@core/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

export interface ServiceStatus {
  title: string;
  status: "online" | "offline";
  header: { title: string; description: string; value: string; icon: LucideIcon };
  content: {
    icon: LucideIcon;
    title: string;
    value: string;
    trailing: {
      label: string;
      value: string;
    } | null;
  }[];
}

type Props = {
  data: ServiceStatus;
};

export default function ServiceStatusCard({ data }: Props) {
  const statusBadge = data.status === "online" ? "positive" : "destructive";

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-lg border border-gray-700">
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle className="text-sm md:text-base">{data.title}</CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`px-3 py-1 rounded-full font-medium`} variant={statusBadge}>
            {data.status === "online" ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2 ">
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          <data.header.icon className="w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-xs">{data.header.title}</span>
            <span className="text-sm font-medium">
              {data.header.description} {data.header.value}
            </span>
          </div>
        </div>

        <Separator className="my-2 my-4" />

        <ul className="space-y-5">
          {data.content.map(item => (
            <li key={item.title} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.title}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </div>

              {item.trailing && (
                <div className="text-xs text-muted-foreground">
                  {item.trailing.label}: {item.trailing.value}
                </div>
              )}
            </li>
          ))}

          {/* <li className="flex items-center justify-between">
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
          </li> */}
        </ul>
      </CardContent>
    </Card>
  );
}
