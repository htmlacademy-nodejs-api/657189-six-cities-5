export interface Config<T> {
  get<Key extends keyof T>(key: Key): T[Key]
}
