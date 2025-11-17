import ServiceStatusCard from "./components/service_status_card.component";
import { Clock, Database, Server } from "lucide-react";

export default function Page() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-start p-16 gap-8">
        <h1 className="text-4xl font-semibold">Service status</h1>

        <ServiceStatusCard
          data={{
            title: "Database health",
            status: "online",
            header: {
              title: "Postgres status",
              description: "Version",
              value: "17.5",
              icon: Database,
            },
            content: [
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
            ],
          }}
        />
      </main>
    </>
  );
}
