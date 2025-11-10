const serverPingDelayInMillis = 200;
const serverMaxRetries = 50;

async function waitWebService() {
  console.log("🟡 Web Server - waiting");
  const pingResult = await pingWebservice(0, serverMaxRetries);

  if (pingResult == null) {
    console.log("✅ Web server is running");
    return;
  }

  console.error(`\n❌ ${pingResult}`);
  throw Error(pingResult);
}

async function pingWebservice(currentAttempt: number, maxAttempts: number): Promise<null | string> {
  try {
    const response = await fetch("http://localhost:3000/api/v1/status");
    await response.json();
    process.stdout.write("🟢 Server is up");
    return;
  } catch (err) {
    if (currentAttempt >= maxAttempts) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return errorMessage;
    }
    return pingWebservice(currentAttempt + 1, maxAttempts);
  }
}
