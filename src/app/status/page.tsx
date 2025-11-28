"use client";

import React from "react";
import useSWR, { SWRResponse } from "swr";
import ServiceStatusCard from "./components/service-status-card.component";
import { Clock, Database, Server } from "lucide-react";

import fetcher from "@core/api/fetcher";
import ServiceStatusUpdatedAt from "./components/service-status-updated-at.component";
import { Spinner } from "@core/components/ui/spinner";
import { Button } from "@core/components/ui/button";
import AppStatusModel from "@model/app-status.model";

export default function Page() {
  const { data, isLoading, error, mutate } = useAppStatus();

  if (isLoading) {
    return (
      <main className="flex w-full min-h-screen flex-col items-center justify-center p-8" aria-live="polite">
        <h1 className="text-xl mb-4">Fetching service status</h1>
        <Spinner className="w-12 h-12" />
      </main>
    );
  }

  if (error) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center p-8 flex-col gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">Error loading service status</h1>
          <p className="mt-2 text-sm text-muted-foreground">Could not fetch service status. Please try again.</p>
        </div>
        <Button
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
          size="lg"
          onClick={async () => {
            await mutate(undefined, { revalidate: true });
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return <Content data={data} />;
}

type ContentProps = {
  data: AppStatusModel;
};

function Content({ data }: ContentProps) {
  return (
    <main className="flex min-h-screen flex-col items-start p-16 gap-8">
      <h1 className="text-4xl font-semibold">Service status</h1>

      <section className="flex flex-row gap-8 w-full">
        <ServiceStatusCard
          title="Database health"
          status={data.databaseHealth?.isOnline ? "online" : "offline"}
          header={{
            title: "Postgres status",
            description: "Version",
            value: data.databaseHealth?.version ?? "—",
            icon: Database,
          }}
          content={[
            {
              icon: Server,
              title: "Connections",
              value: data.databaseHealth?.connectionsAvailable ?? "—",
              trailing: {
                label: "open",
                value: data.databaseHealth?.openConnections ?? "—",
              },
            },
            {
              icon: Clock,
              title: "Latency",
              value: data.databaseHealth.latency.join("-"),
              trailing: null,
            },
          ]}
        />
      </section>

      <ServiceStatusUpdatedAt timestamp={data.updatedAt} />
    </main>
  );
}

function useAppStatus(): SWRResponse<AppStatusModel, Error> {
  return useSWR<AppStatusModel, Error>("/api/v1/status", fetcher, {
    refreshInterval: 2000,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
}
