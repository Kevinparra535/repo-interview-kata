export interface HomeRepository {
  getWelcomeMessage(): Promise<string>;
}
