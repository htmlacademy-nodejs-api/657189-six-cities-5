export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserServcie: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  RentOfferModel: Symbol.for('RentOfferModel'),
  RentOfferService: Symbol.for('RentOfferService'),
  CommentModel: Symbol.for('CommentModel'),
  CommentService: Symbol.for('CommentService'),
} as const;
