import { Expose, Type } from 'class-transformer';
import { Comment } from '../../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export default class CommentRDO implements Comment {
  @Expose()
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose()
  public createdAt: Date;

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public author: UserRdo;
}
