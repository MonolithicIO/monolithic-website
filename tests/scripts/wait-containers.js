const { exec } = require("node:child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

// Add more containers as the project evolves
const containers = [
  {
    containerName: "postgres-db",
    command: "docker exec postgres-db pg_isready --host localhost",
    successOutput: "accepting connections",
  },
];

const retryDelay = 200;
const maxRetryAttempts = 50;

async function waitContainer(container, maxAttempts = maxRetryAttempts) {
  const { containerName, command, successOutput } = container;
  console.log(`🟡 ${containerName} - waiting`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { stdout } = await execAsync(command);

      if (stdout.includes(successOutput)) {
        process.stdout.write(`\r🟢 ${containerName} - ready\n`);
        return true;
      }
    } catch (error) {}

    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error(`Container ${containerName} failed to initialize after ${maxAttempts} attempts`);
}

async function waitContainers() {
  console.log("🚀 Waiting for containers to be ready...\n");

  const promises = containers.map(container => waitContainer(container));

  try {
    await Promise.all(promises);
    console.log("\n✅ All containers are ready!");
  } catch (error) {
    console.error(`\n❌ ${error.message}`);
    throw error;
  }
}

waitContainers().catch(error => {
  process.exit(1);
});
