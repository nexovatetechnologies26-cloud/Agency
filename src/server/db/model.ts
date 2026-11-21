import "server-only";
import mongoose, { type Model, type Schema } from "mongoose";

/**
 * Registers a Mongoose model once per process.
 *
 * In development, Next.js hot-reloads modules but Mongoose keeps the first
 * compiled model in memory. Fields added to a schema later would then be
 * silently dropped on save until the dev server restarts. Re-registering the
 * model on every reload in development keeps it in sync with the schema.
 * Production processes start fresh, so the cached model is reused there.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the schema's own type is not needed here; callers pass T
export function defineModel<T>(name: string, schema: Schema<any>): Model<T> {
  if (process.env.NODE_ENV !== "production" && mongoose.models[name]) {
    mongoose.deleteModel(name);
  }
  return (mongoose.models[name] ?? mongoose.model(name, schema)) as unknown as Model<T>;
}
