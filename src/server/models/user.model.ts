import "server-only";
import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { ROLES } from "@/lib/permissions";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 200 },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ROLES, required: true, default: "customer", index: true },
    active: { type: Boolean, default: true },

    country: { type: String, uppercase: true, maxlength: 2 },
    timezone: { type: String, maxlength: 60 },
    phone: { type: String, maxlength: 30 },
    company: { type: String, maxlength: 150 },
    marketingConsent: { type: Boolean, default: false },

    emailVerifiedAt: { type: Date },
    verifyTokenHash: { type: String, select: false, index: true, sparse: true },
    resetTokenHash: { type: String, select: false, index: true, sparse: true },
    resetTokenExpires: { type: Date, select: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User: Model<UserDoc> = (models.User as Model<UserDoc>) || model("User", userSchema);
