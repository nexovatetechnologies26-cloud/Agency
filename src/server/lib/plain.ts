import "server-only";

// Converts Mongo documents (ObjectIds, Dates) into plain JSON-safe objects
// so they can be passed from server components to client components.

export type Plain<T> = T extends Date
  ? string
  : T extends { toHexString(): string }
    ? string
    : T extends Array<infer U>
      ? Plain<U>[]
      : T extends object
        ? { [K in keyof T as K extends "__v" ? never : K]: Plain<T[K]> }
        : T;

export function plain<T>(value: T): Plain<T> {
  return JSON.parse(JSON.stringify(value)) as Plain<T>;
}
