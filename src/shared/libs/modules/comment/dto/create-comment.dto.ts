import { Comment } from '../../../../types/comment.type.js';

export class CreateCommentDto implements Omit<Comment, 'author'> {
  public rating: number;
  public createdAt: Date;
  public text: string;
  public rentOfferId: string;
  public authorId: string;
}
