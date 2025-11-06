export interface IPasswordStrategy {
  compare(plainText: string, hash: string): Promise<boolean>;
  hash(plainText: string): Promise<string>;
}
