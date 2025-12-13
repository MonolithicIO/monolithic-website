type Draft = {
  id: string;
  postId: string | null;
  title: string;
  markdownContent: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  type: "NEW" | "EDIT";
};

export default Draft;
