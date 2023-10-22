import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Comment } from '../../../types/comment.type.js';
import { RentOfferEntity } from '../rent-offer/index.js';
import { UserEntity } from '../user/index.js';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})
export class CommentEntity extends defaultClasses.TimeStamps implements Omit<Comment, 'author' | 'createdAt'> {
  @prop({ trim: true, required: true, minlength: 5, maxlength: 1024 })
  public text: string;

  @prop({required: true, min: 1, max: 5})
  public rating: number;

  @prop({
    ref: RentOfferEntity,
    required: true
  })
  public offerId: Ref<RentOfferEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
