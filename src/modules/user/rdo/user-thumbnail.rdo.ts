import { Expose } from 'class-transformer';

export class UserThumbnailRdo {
  @Expose({ name: 'thumbnail' })
  public thumbnailUrl!: string;
}
