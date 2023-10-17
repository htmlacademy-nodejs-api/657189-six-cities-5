export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserServcie: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  RentOfferModel: Symbol.for('RentOfferModel'),
  RentOfferService: Symbol.for('RentOfferService'),
} as const;
