export abstract class CustomError extends Error {
  constructor() {
    super();
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
