/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  pgm.createTable("roles", {
    id: {
      type: "serial",
      primaryKey: true,
      comment: "UUID unique key",
    },
    name: {
      name: "name",
      type: "varchar(255)",
      notNull: true,
      comment: "Role name",
    },
    description: {
      name: "description",
      type: "varchar(255)",
      notNull: true,
      comment: "Role description",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });
  pgm.sql(`INSERT INTO roles (name, description) VALUES ('owner', 'Owner role')`);
  pgm.sql(`INSERT INTO roles (name, description) VALUES ('admin', 'Admin role')`);
  pgm.sql(`INSERT INTO roles (name, description) VALUES ('author', 'Author role')`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {};
