export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  UserController: Symbol.for('UserController'),
  RentOfferModel: Symbol.for('RentOfferModel'),
  RentOfferService: Symbol.for('RentOfferService'),
  RentOfferController: Symbol.for('RentOfferController'),
  CommentModel: Symbol.for('CommentModel'),
  CommentService: Symbol.for('CommentService'),
  CommentController: Symbol.for('CommentController')
} as const;
