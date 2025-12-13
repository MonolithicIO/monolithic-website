import { ForbiddenError, NotFoundError } from "@errors/api.error";
import UserRoleModel from "@model/user-role.model";
import DraftsRepository from "@repository/drafts.repository";

export default class DeleteDraftService {
  private readonly draftRepository: DraftsRepository;

  constructor(draftRepository: DraftsRepository = new DraftsRepository()) {
    this.draftRepository = draftRepository;
  }

  async deleteDraft(props: { draftId: string; userId: string; roles: UserRoleModel[] }): Promise<void> {
    if (!props.roles.includes(UserRoleModel.Author)) {
      throw new ForbiddenError("Forbidden access to resource. User is not an author.");
    }

    const draft = await this.draftRepository.getDraftDetails(props.draftId);

    if (!draft) {
      throw new NotFoundError("Draft not found");
    }

    if (props.userId != draft.authorId) {
      throw new ForbiddenError("Forbidden access to resource");
    }

    await this.draftRepository.deleteDraft(props.draftId);
  }
}
