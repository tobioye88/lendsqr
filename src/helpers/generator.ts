export class Generator {
  static generateAccountNumber(): string {
    return Math.floor(Math.random() * 1000000000) + "";
  }
}