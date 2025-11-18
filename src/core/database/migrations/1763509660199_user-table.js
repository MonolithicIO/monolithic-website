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
  pgm.createTable("users", {
    id: {
      type: "varchar(128)",
      primaryKey: true,
      comment: "UID do Firebase Auth",
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    display_name: {
      type: "varchar(255)",
      notNull: false,
    },
    photo_url: {
      type: "text",
      notNull: false,
    },
    phone_number: {
      type: "varchar(20)",
      notNull: false,
      unique: true,
    },
    email_verified: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    provider: {
      type: "varchar(50)",
      notNull: false,
      comment: "Provider de autenticação (google.com, password, etc)",
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

  pgm.createIndex("users", "email", {
    name: "idx_users_email",
  });

  pgm.createTrigger("users", "set_updated_at", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  pgm.dropIndex("users", "email", {
    name: "idx_users_email",
    ifExists: true,
  });

  pgm.sql(`
    DROP TRIGGER IF EXISTS trigger_update_users_updated_at ON users;
  `);

  pgm.dropTable("users", {
    ifExists: true,
  });
};
