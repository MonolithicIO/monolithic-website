import MigrationsService from "@services/migrations.service";
import ConcludedMigration from "@model/concluded-migration.model";
import MigrationsRepositoryMock from "tests/mock/repository/migrations.repository.mock";

describe("MigrationsServiceImpl", () => {
  let service: MigrationsService;
  let mockRepository: MigrationsRepositoryMock;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockRepository = new MigrationsRepositoryMock();
    service = new MigrationsService(mockRepository);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe("runDryMigrations", () => {
    const mockMigrations: ConcludedMigration[] = [
      { path: "migrations/1", name: "migration1", timestamp: 123 },
      { path: "migrations/2", name: "migration2", timestamp: 123 },
    ];

    describe("in dev environment", () => {
      beforeEach(() => {
        process.env = { ...originalEnv, NODE_ENV: "development" };
      });

      it("should run migrations without validating key", async () => {
        mockRepository.dryResponse = mockMigrations;

        const result = await service.runDryMigrations("any-key");

        expect(result).toEqual(mockMigrations);
      });

      it("should return failure if repository throws an error", async () => {
        const error = new Error("Database connection failed");
        mockRepository.dryResponse = error;

        const result = await service.runDryMigrations("any-key");

        expect(result).toBe("failure");
      });
    });

    describe("in production environment", () => {
      beforeEach(() => {
        process.env = { ...originalEnv, NODE_ENV: "production", MIGRATIONS_KEY: "123" };
      });

      it("should run migrations given correct key", async () => {
        mockRepository.dryResponse = mockMigrations;

        const result = await service.runDryMigrations("123");

        expect(result).toEqual(mockMigrations);
      });

      it("should return unauthorized given wrong key", async () => {
        const result = await service.runDryMigrations("wrong-key");

        expect(result).toBe("unauthorized");
      });

      it("should return unauthorized if key is undefined", async () => {
        delete process.env.MIGRATIONS_KEY;

        const result = await service.runDryMigrations("any-key");

        expect(result).toBe("unauthorized");
      });
    });
  });

  describe("runLiveMigrations", () => {
    const mockMigrations: ConcludedMigration[] = [
      { path: "migrations/1", name: "migration1", timestamp: 123 },
      { path: "migrations/2", name: "migration2", timestamp: 123 },
    ];

    describe("in dev environment", () => {
      beforeEach(() => {
        process.env = { ...originalEnv, NODE_ENV: "development" };
      });

      it("should run migrations without validating key", async () => {
        mockRepository.liveResponse = mockMigrations;

        const result = await service.runLiveMigrations("any-key");

        expect(result).toEqual(mockMigrations);
      });

      it("should return failure if repository throws an error", async () => {
        const error = new Error("Database connection failed");
        mockRepository.liveResponse = error;

        const result = await service.runLiveMigrations("any-key");

        expect(result).toBe("failure");
      });
    });

    describe("in production environment", () => {
      beforeEach(() => {
        process.env = { ...originalEnv, NODE_ENV: "production", MIGRATIONS_KEY: "123" };
      });

      it("should run migrations given correct key", async () => {
        mockRepository.liveResponse = mockMigrations;

        const result = await service.runLiveMigrations("123");

        expect(result).toEqual(mockMigrations);
      });

      it("should return unauthorized given wrong key", async () => {
        const result = await service.runLiveMigrations("wrong-key");

        expect(result).toBe("unauthorized");
      });

      it("should return unauthorized if key is undefined", async () => {
        delete process.env.MIGRATIONS_KEY;

        const result = await service.runLiveMigrations("any-key");

        expect(result).toBe("unauthorized");
      });
    });
  });
});
