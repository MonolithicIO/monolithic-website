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
  pgm.createTrigger("roles", "set_updated_at", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });

  pgm.createTrigger("user_roles", "set_updated_at", {
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
exports.down = pgm => {};
