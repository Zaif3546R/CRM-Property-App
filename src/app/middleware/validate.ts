import { NextRequest } from "next/server";

export interface ValidationSchema {
  [key: string]: {
    required: boolean;
    type?: "string" | "number" | "email";
    min?: number;
    max?: number;
  };
}

export async function validatePayload(
  req: NextRequest,
  schema: ValidationSchema
) {
  try {
    const body = await req.json();
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      // 1. Required Check
      if (rules.required) {
        if (value === undefined || value === null || value === "") {
          errors.push(`${field} is required`);
          continue;
        }
      }

      // 2. Type/Format Checks (only if value exists)
      if (value !== undefined && value !== null && value !== "") {
        if (rules.type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
          errors.push(`${field} must be a valid email`);
        }
        if (rules.type === "number" && isNaN(Number(value))) {
          errors.push(`${field} must be a valid number`);
        }
        if (rules.type === "string" && typeof value !== "string") {
          errors.push(`${field} must be a string`);
        }
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return { isValid: true, data: body };
  } catch (error) {
    return { isValid: false, errors: ["Invalid JSON body"] };
  }
}