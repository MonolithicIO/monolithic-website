import { ForbiddenError, NotFoundError } from "@errors/api.error";
import Draft from "@model/draft.model";
import UserRoleModel from "@model/user-role.model";
import DraftsRepository from "@repository/drafts.repository";

export default class DraftDetailsService {
  private readonly draftRepository: DraftsRepository;

  constructor(draftRepository: DraftsRepository = new DraftsRepository()) {
    this.draftRepository = draftRepository;
  }

  async getDraftDetails(props: { draftId: string; userId: string; roles: UserRoleModel[] }): Promise<Draft> {
    if (!props.roles.includes(UserRoleModel.Author)) {
      throw new ForbiddenError("Forbidden access to resource. User is not an author.");
    }

    const draft = await this.draftRepository.getDraftDetails(props.draftId);

    if (!draft) {
      throw new NotFoundError("Draft not found");
    }

    if (draft.authorId != props.userId) {
      throw new ForbiddenError("Forbidden access to resource");
    }

    return draft;
  }
}
