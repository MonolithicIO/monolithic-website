describe("GET api/v1/migrations", () => {
  test("should return migrations to be executed", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations");
    expect(response.status).toBe(200);
  });
});
