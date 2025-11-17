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

    test("should return failed model if database check fails", async () => {
      const healthResponse = new Error("Sample");
      databaseHealthRepository.response = healthResponse;
      const result = await service.getAppStatus();

      expect(result.databaseHealth.isOnline).toBe(false);
      expect(result.databaseHealth.connectionsAvailable).toBe("n/a");
      expect(result.databaseHealth.openConnections).toBe("n/a");
      expect(result.databaseHealth.latency.length).toBe(3);
      expect(result.databaseHealth.version).toBe("n/a");
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
