import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import dayjs from 'dayjs';
import { CityNames } from '../../types/city.type.js';
import { HouseType } from '../../types/house-type.type.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import { Goods } from '../../types/goods.type.js';
import {
  CITIES,
  COLUMNS_SEPARATOR,
  MULTI_VALUES_SEPARATOR,
} from '../../constants/index.js';
import { UserStatus } from '../../types/user.type.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100_000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_RATING = 0;
const MAX_RATING = 10;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_ADULTS = 1;
const MAX_ADULTS = 8;

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 100;

const BOOLEAN_OPTIONS = [true, false];

export class TSVRentOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  generate(): string {
    const mockData = this.mockData;

    const title: string = getRandomItem(mockData.titles);
    const description: string = getRandomItem(mockData.descriptions);
    const offerDate: string = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city: CityNames = getRandomItem(Object.values(CityNames));
    const previewImage: string = getRandomItem(mockData.images);
    const images: string = getRandomItems(mockData.images).join(
      MULTI_VALUES_SEPARATOR,
    );
    const isPremium: boolean = getRandomItem(BOOLEAN_OPTIONS);
    const isFavorite: boolean = getRandomItem(BOOLEAN_OPTIONS);
    const rating: number = generateRandomValue(MIN_RATING, MAX_RATING);
    const type: HouseType = getRandomItem(Object.values(HouseType));
    const rooms: number = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const maxAdults: number = generateRandomValue(MIN_ADULTS, MAX_ADULTS);
    const price: number = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods: string = getRandomItems(Object.values(Goods)).join(
      MULTI_VALUES_SEPARATOR,
    );
    const lat: number = CITIES[city].lat;
    const lon: number = CITIES[city].lon;
    const username: string = getRandomItem(mockData.usernames);
    const email: string = getRandomItem(mockData.emails);
    const userStatus: UserStatus = getRandomItem(Object.values(UserStatus));
    const thumbnailUrl: string = getRandomItem(Object.values(mockData.images));
    const commentsCount: number = generateRandomValue(
      MIN_COMMENTS_COUNT,
      MAX_COMMENTS_COUNT,
    );

    return [
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
      rooms,
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
    ].join(COLUMNS_SEPARATOR);
  }
}
