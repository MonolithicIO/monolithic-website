"use client";

import useSWR, { SWRResponse } from "swr";
import ServiceStatusCard from "./components/service_status_card.component";
import { Clock, Database, Server } from "lucide-react";
import { AppStatusModel } from "@model/app-status.model";
import fetcher from "@core/api/fetcher";

export default function Page() {
  const { data, isLoading, error } = useAppStatus();

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (error) {
    return <h1>Error</h1>;
  }

  return (
    <main className="flex min-h-screen flex-col items-start p-16 gap-8">
      <h1 className="text-4xl font-semibold">Service status</h1>

      <section className="flex flex-row gap-8 w-full">
        <ServiceStatusCard
          title="Database health"
          status={data.databaseHealth.isOnline ? "online" : "offline"}
          header={{
            title: "Postgres status",
            description: "Version",
            value: data.databaseHealth.version,
            icon: Database,
          }}
          content={[
            {
              icon: Server,
              title: "Connections",
              value: data.databaseHealth.connectionsAvailable,
              trailing: {
                label: "open",
                value: data.databaseHealth.openConnections,
              },
            },
            {
              icon: Clock,
              title: "Latency",
              value: data.databaseHealth.latency.join("--"),
              trailing: null,
            },
          ]}
        />
      </section>
    </main>
  );
}

export function useAppStatus(): SWRResponse<AppStatusModel> {
  const response = useSWR<AppStatusModel>("/api/v1/status", fetcher, {
    refreshInterval: 2000,
  });

  return response;
}
