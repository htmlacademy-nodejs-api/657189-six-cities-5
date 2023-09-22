import {
  Goods,
  User,
  HousingOffer,
  UserStatus,
  HouseType,
  CityNames,
} from "../../types/index.js";
import { FileReader } from "./file-reader.interface.js";
import { readFileSync } from "fs";

const TITLE_ROWS_TO_REMOVE = 1;
const RADIX = 10;

export class TSVFileReader implements FileReader {
  private rawData: string | undefined;

  constructor(private readonly filename: string) {}

  public read(): void {
    try {
      this.rawData = readFileSync(this.filename, { encoding: "utf-8" });
    } catch (error) {
      throw new Error("File is not readable");
    }
  }

  public toArray(): HousingOffer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split("\n")
      .filter((row) => row.trim() !== "")
      .map((row) => row.split("\t"))
      .slice(TITLE_ROWS_TO_REMOVE)
      .map((offer) => {
        const [
          title,
          description,
          offerDate,
          city,
          previewImage,
          images,
          isPremium,
          isFavorite,
          rating,
          type,
          bedrooms,
          maxAdults,
          price,
          goods,
          lat,
          lon,
          username,
          email,
          userStatus,
          thumbnailUrl,
          commentsCount,
        ] = offer;

        const offerImages: string[] = images.split(";");
        const offerGoods = goods.split(";") as Goods[];
        const user: User = {
          username,
          email,
          thumbnailUrl,
          userStatus: userStatus as UserStatus,
        };
        const result: HousingOffer = {
          title,
          description,
          offerDate: new Date(offerDate),
          city: city as CityNames,
          previewImage,
          images: offerImages,
          isPremium: isPremium === "true",
          isFavorite: isFavorite === "true",
          rating: Number.parseFloat(rating),
          type: type as HouseType,
          bedrooms: Number.parseInt(bedrooms, RADIX),
          maxAdults: Number.parseInt(maxAdults, RADIX),
          price: Number.parseInt(price, RADIX),
          goods: offerGoods,
          createdBy: user,
          lat: Number.parseFloat(lat),
          lon: Number.parseFloat(lon),
          commentsCount: Number.parseInt(commentsCount),
        };

        return result;
      });
  }
}
