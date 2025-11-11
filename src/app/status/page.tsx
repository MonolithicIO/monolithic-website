import { Badge } from "@core/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@core/components/ui/card";

export default function Page() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-start p-16 gap-16">
        <h1 className="text-4xl font-semibold">Service status</h1>
        <section className="flex flex-wrap w-full flex-row gap-16 justify-start">
          <Card className="w-full sm:w-64 md:w-80 lg:w-96">
            <CardHeader>
              <CardTitle>Database Health</CardTitle>
              <CardDescription>Postgre Status</CardDescription>
              <CardAction>
                <Badge variant="positive">Online</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>Connections: 94</p>
              <p>Open connections: 6</p>
              <p>Latency: 5, 5, 5</p>
              <p>Version: 17.5</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
