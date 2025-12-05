const { boolean } = require("zod");

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
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  pgm.createTable("refresh_tokens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "Auto-incrementing UUID unique key",
    },
    user_id: {
      type: "varchar",
      notNull: true,
      comment: "User ID",
    },
    token: {
      type: "varchar(255)",
      notNull: true,
      comment: "Refresh token",
    },
    expires_at: {
      type: "timestamp",
      notNull: true,
      comment: "Token expiration date",
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
    is_consumed: {
      type: "boolean",
      default: false,
      notNull: true,
      comment: "Token consumption status",
    },
    is_revoked: {
      type: "boolean",
      default: false,
      notNull: true,
      comment: "Token revocation status",
    },
  });

  pgm.createTrigger("refresh_tokens", "set_updated_at", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });

  pgm.createIndex("refresh_tokens", "token", {
    name: "idx_refresh_tokens_token",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {};
