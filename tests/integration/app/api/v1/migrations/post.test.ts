describe("POST api/v1/migrations", () => {
  test("should return migrations executed", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations", { method: "POST" });
    expect(response.status).toBe(200);
  });
});
