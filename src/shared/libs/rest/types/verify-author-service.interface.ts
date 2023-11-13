export interface VerifyAuthorService {
  verifyAuthorUserId(userId: string, idToVerify: string): Promise<boolean>;
}
