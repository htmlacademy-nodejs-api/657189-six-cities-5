import { MinLength, MaxLength, IsInt, Max, Min, IsMongoId } from 'class-validator';
import { Comment } from '../../../shared/types/comment.type.js';
import { COMMENT_LENGTH, COMMENT_RATING } from '../comment.constants.js';

export class CreateCommentDto implements Omit<Comment, 'author' | 'createdAt'> {
  @IsInt({message: 'rating must be an integer'})
  @Min(COMMENT_RATING.MIN, {message: `rating min value is ${COMMENT_RATING.MIN}`})
  @Max(COMMENT_RATING.MAX, {message: `rating min value is ${COMMENT_RATING.MAX}`})
  public rating: number;

  @MinLength(COMMENT_LENGTH.MIN, {message: `Minimum comment length must be ${COMMENT_LENGTH.MIN} chars`})
  @MaxLength(COMMENT_LENGTH.MAX, {message: `Minimum comment length must be ${COMMENT_LENGTH.MAX} chars`})
  public text: string;

  @IsMongoId({message: 'offerId field must be a valid id'})
  public rentOfferId: string;

  @IsMongoId({message: 'authorId field must be a valid id'})
  public authorId: string;
}
