import { IsBoolean } from 'class-validator';

export class FavoriteOfferDto {
  @IsBoolean({ message: 'isFavorite param must be a boolean' })
  public isFavorite: boolean;
}
