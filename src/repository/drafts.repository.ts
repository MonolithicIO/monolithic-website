import { DatabaseProvider } from "@core/database/database.provider";
import Draft from "@model/draft.model";

type DraftFilters = {
  authorId: string;
};

export default class DraftsRepository {
  private readonly databaseProvider: DatabaseProvider;

  constructor(databaseProvider: DatabaseProvider = new DatabaseProvider()) {
    this.databaseProvider = databaseProvider;
  }

  async createDraft(userId: string, title: string, postId: string | null): Promise<string> {
    let mode: string;
    if (postId) {
      mode = "EDIT";
    } else {
      mode = "NEW";
    }

    const query = await this.databaseProvider.query(
      "`INSERT INTO drafts (user_id, title, post_id, type) VALUES ($1, $2, $3, $4)`",
      [userId, title, postId, mode]
    );

    return query[0].id;
  }

  async getDraftDetails(draftId: string): Promise<Draft | null> {
    const query = await this.databaseProvider.query("`SELECT * FROM drafts WHERE id = $1`", [draftId]);

    if (!query[0]) return null;
    const object = query[0];

    return {
      id: object.id,
      postId: object.post_id,
      title: object.title,
      markdownContent: object.markdown_content,
      authorId: object.author_id,
      createdAt: object.created_at,
      updatedAt: object.updated_at,
      type: object.type,
    };
  }

  async updateDraft(draftId: string, title: string, markdownContent: string): Promise<void> {
    await this.databaseProvider.query("`UPDATE drafts SET title = $2, markdown_content = $3 WHERE id = $1`", [
      draftId,
      title,
      markdownContent,
    ]);
  }

  async deleteDraft(draftId: string): Promise<void> {
    await this.databaseProvider.query("`DELETE FROM drafts WHERE id = $1`", [draftId]);
  }

  async listDrafts(filters: DraftFilters, page: number, pageSize: number): Promise<Draft[]> {
    const offset = (page - 1) * pageSize;
    const query = await this.databaseProvider.query(
      "`SELECT * FROM drafts WHERE author_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`",
      [filters.authorId, pageSize, offset]
    );

    return query.map(object => {
      return {
        id: object.id,
        postId: object.post_id,
        title: object.title,
        markdownContent: object.markdown_content,
        authorId: object.author_id,
        createdAt: object.created_at,
        updatedAt: object.updated_at,
        type: object.type,
      };
    });
  }
}
