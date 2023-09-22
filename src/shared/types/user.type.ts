export enum UserStatus {
  Standard = 'standard',
  Pro = 'pro',
}

export type User = {
  username: string;
  email: string;
  userStatus: UserStatus;
  thumbnailUrl?: string;
};
