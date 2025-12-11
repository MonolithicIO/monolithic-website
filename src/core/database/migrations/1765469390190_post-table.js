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
  // Tables
  pgm.createTable("posts", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    markdown_content: {
      type: "text",
      notNull: false,
    },
    author_id: {
      type: "varchar",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    published_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    active_draft_id: {
      type: "uuid",
    },
  });

  pgm.createTable("drafts", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    post_id: {
      type: "uuid",
      references: "posts(id)",
      onDelete: "CASCADE",
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    markdown_content: {
      type: "text",
    },
    author_id: {
      type: "varchar",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    type: {
      type: "varchar(20)",
      notNull: true,
      check: "type IN ('NEW', 'EDIT')",
      comment:
        "Type of draft. If new, references a draft version of a post to be published. If edit, references a draft version of a post to be edited.",
    },
  });

  // Constraints
  pgm.addConstraint("posts", "fk_posts_active_draft", {
    foreignKeys: {
      columns: "active_draft_id",
      references: "drafts(id)",
      onDelete: "SET NULL",
    },
  });

  // Triggers
  pgm.createTrigger("drafts", "set_updated_at", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });

  pgm.createTrigger("posts", "set_updated_at", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });

  // Indexes
  pgm.createIndex("posts", "author_id", {
    name: "idx_posts_author",
  });

  pgm.createIndex("posts", "published_at", {
    name: "idx_posts_published_at",
    method: "btree",
  });

  pgm.createIndex("drafts", "author_id", {
    name: "idx_drafts_author",
  });

  pgm.createIndex("drafts", "post_id", {
    name: "idx_drafts_post",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {};
