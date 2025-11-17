"use client";

import useSWR from "swr";
import ServiceStatusCard from "./components/service_status_card.component";
import { Clock, Database, Server } from "lucide-react";
// import { AppStatusModel } from "@model/app-status.model";

export default function Page() {
  const client = useSWR("status", getAppStatus);

  return (
    <main className="flex min-h-screen flex-col items-start p-16 gap-8">
      <h1 className="text-4xl font-semibold">Service status</h1>
      <span>{JSON.stringify(client.data)}</span>
      <ServiceStatusCard
        title="Database health"
        status="online"
        header={{
          title: "Postgres status",
          description: "Version",
          value: "17.5",
          icon: Database,
        }}
        content={[
          {
            icon: Server,
            title: "Connections",
            value: "20",
            trailing: {
              label: "open",
              value: "20",
            },
          },
          {
            icon: Clock,
            title: "Latency",
            value: "5ms -- 5ms -- 5ms",
            trailing: null,
          },
        ]}
      />
    </main>
  );
}

async function getAppStatus(): Promise<string> {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const body = await response.json();
  return body;
}
