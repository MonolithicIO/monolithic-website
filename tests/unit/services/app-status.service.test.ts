import DatabaseHealthRepositoryMock from "@mocks/repository/database-health.repository.mock";
import DatabaseHealthModel from "@model/database-health.model";
import AppStatusService from "@services/app-status.service";

describe("AppStatusServiceImpl", () => {
  let service: AppStatusService;
  let databaseHealthRepository: DatabaseHealthRepositoryMock;

  beforeEach(() => {
    jest.resetModules();
    databaseHealthRepository = new DatabaseHealthRepositoryMock();
    service = new AppStatusService(databaseHealthRepository);
  });

  describe("get app status", () => {
    test("should return app status", async () => {
      const healthResponse = defaultDatabaseHealth;
      databaseHealthRepository.response = healthResponse;
      const response = await service.getAppStatus();
      expect(response.databaseHealth).toBe(healthResponse);
    });

    test("should propagate repository exceptions", async () => {
      const healthResponse = new Error("Sample");
      databaseHealthRepository.response = healthResponse;

      await expect(service.getAppStatus()).rejects.toThrow();
    });
  });
});

const defaultDatabaseHealth: DatabaseHealthModel = {
  isOnline: true,
  connectionsAvailable: "90",
  openConnections: "10",
  latency: ["1", "2"],
  version: "123",
};
