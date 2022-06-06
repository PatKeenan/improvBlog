import { Contribution, Post, User} from "@prisma/client";

// Used for editing a post
export interface EditablePostFields extends Partial<Pick<Post, "title" | "plot" | "private">> {
}

// Used in components where user details are returned with a post
export interface PostIncludingAuthor extends Post {
  author: User
}

export interface CreateEditContribution {
  content: Contribution['content']
  blockId: Contribution["blockId"]
  postId: Contribution["postId"]
}