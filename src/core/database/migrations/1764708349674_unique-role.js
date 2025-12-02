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
  pgm.addColumn("roles", {
    is_unique: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });

  pgm.sql(`CREATE UNIQUE INDEX idx_roles_name ON roles (name)`);

  pgm.sql("UPDATE roles SET is_unique = true WHERE name = 'owner'");

  pgm.createFunction(
    "check_unique_role",
    [],
    {
      returns: "trigger",
      language: "plpgsql",
      replace: true,
    },
    `
    BEGIN 
    IF EXISTS (
        SELECT 1 FROM roles 
        WHERE id = NEW.role_id AND is_unique = true
    ) THEN
        IF EXISTS (
            SELECT 1 FROM user_roles 
            WHERE role_id = NEW.role_id 
            AND user_id != NEW.user_id
        ) THEN
            RAISE EXCEPTION 'Esta role já está atribuída a outro usuário';
        END IF;
    END IF;
    RETURN NEW;
    END;
    `
  );

  pgm.createTrigger("user_roles", "trigger_check_unique_role", {
    when: "BEFORE",
    operation: "INSERT",
    function: "check_unique_role",
    level: "ROW",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {};
