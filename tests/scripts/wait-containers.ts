import { exec } from "node:child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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

const retryDelay = 200;
const maxRetryAttempts = 50;

async function waitContainer(container: ContainerConfig, maxAttempts: number = maxRetryAttempts): Promise<boolean> {
  const { containerName, command, successOutput } = container;
  console.log(`🟡 ${containerName} - waiting`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { stdout } = (await execAsync(command)) as { stdout: string; stderr: string };

      if (stdout.includes(successOutput)) {
        process.stdout.write(`\r🟢 ${containerName} - ready\n`);
        return true;
      }
    } catch (error) {
      // No-op. Container may not be ready.
    }

    if (attempt < maxAttempts) {
      await new Promise<void>(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error(`Container ${containerName} failed to initialize after ${maxAttempts} attempts`);
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
