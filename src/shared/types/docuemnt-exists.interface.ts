export interface DocumentExists {
  exists(docId: string): Promise<boolean>;
}
