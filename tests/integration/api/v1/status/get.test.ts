test("/api/v1/status should return 200", async () => {
  const call = await fetch("http://localhost:3000/api/v1/status");

  expect(call.status).toBe(200);
});
