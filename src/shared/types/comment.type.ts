import { User } from './user.type.js';

export type Comment = {
  text: string;
  created: Date;
  rating: number;
  author: User;
};
