import { User } from './user.type.js';

export type Comment = {
  text: string;
  createdAt: Date;
  rating: number;
  author: User;
};
