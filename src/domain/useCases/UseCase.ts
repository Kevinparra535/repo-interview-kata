export interface UseCase<Input, Output> {
  run(data: Input): Promise<Output>;
}
