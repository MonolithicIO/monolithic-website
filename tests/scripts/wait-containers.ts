import { exec } from "node:child_process";

interface ContainerConfig {
  containerName: string;
  command: string;
  successOutput: string;
}

// Add more containers as the project evolves
const containers: ContainerConfig[] = [
  {
    containerName: "postgres-db",
    command: "docker exec postgres-db pg_isready --host localhost",
    successOutput: "accepting connections",
  },
];

async function waitContainer(container: ContainerConfig) {
  const { containerName, command, successOutput } = container;
  console.log(`🟡 ${containerName} - waiting`);
  exec(command, handleExec);

  function handleExec(error: any, stdout: string) {
    if (stdout.search(successOutput) === -1) {
      process.stdout.write(`🟡 ${containerName} - waiting`);
      return waitContainer(container);
    }
    process.stdout.write(`\r🟢 ${containerName} - ready\n`);
  }
}

async function waitContainers(): Promise<void> {
  console.log("🚀 Waiting for containers to be ready...\n");

  const promises = containers.map(container => waitContainer(container));

  try {
    await Promise.all(promises);
    console.log("\n✅ All containers are ready!");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ ${errorMessage}`);
    throw error;
  }
}

// Run if executed directly
waitContainers().catch((error: unknown) => {
  process.exit(1);
});
