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
  pgm.createTable("user_roles", {
    user_id: {
      type: "varchar(128)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
      comment: "References firebase UID from user table",
    },
    role_id: {
      type: "int",
      notNull: true,
      references: "roles(id)",
      onDelete: "CASCADE",
      comment: "References role ID from roles table",
    },
    assigned_by: {
      type: "varchar(128)",
      references: "users(id)",
      onDelete: "SET NULL",
      comment: "References assigned by user ID from user table",
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

  pgm.addConstraint("user_roles", "user_roles_pkey", {
    primaryKey: ["user_id", "role_id"],
  });

  pgm.createIndex("user_roles", "user_id", {
    name: "idx_user_roles_user_id",
  });

  pgm.createIndex("user_roles", "role_id", {
    name: "idx_user_roles_role_id",
  });

  pgm.createIndex("user_roles", "assigned_by", {
    name: "idx_user_roles_assigned_by",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {};
