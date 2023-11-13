import { Ref, defaultClasses, modelOptions, prop } from '@typegoose/typegoose';
import { Comment } from '../../shared/types/comment.type.js';
import { RentOfferEntity } from '../rent-offer/index.js';
import { UserEntity } from '../user/index.js';
import { COMMENT_LENGTH, COMMENT_RATING } from './comment.constants.js';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})
export class CommentEntity extends defaultClasses.TimeStamps implements Omit<Comment, 'author' | 'createdAt'> {
  @prop({
    trim: true,
    required: true,
    minlength: COMMENT_LENGTH.MIN,
    maxlength: COMMENT_LENGTH.MAX,
  })
  public text: string;

  @prop({ required: true, min: COMMENT_RATING.MIN, max: COMMENT_RATING.MAX })
  public rating: number;

  @prop({
    ref: () => RentOfferEntity,
    required: true,
  })
  public offerId: Ref<RentOfferEntity>;

  @prop({
    ref: () => UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;
}
