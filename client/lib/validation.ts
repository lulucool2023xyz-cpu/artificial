/**
 * Validation Schemas using Zod
 * Centralized validation for all forms in the application
 */

import { z } from "zod";

// ===========================
// COMMON VALIDATION RULES
// ===========================

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const strongPasswordSchema = passwordSchema
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

const nameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
  .trim();

// ===========================
// XSS PROTECTION
// ===========================

/**
 * Sanitize string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
    } else if (typeof value === "object" && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(value);
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  return sanitized;
}

// ===========================
// AUTH SCHEMAS
// ===========================

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    fullName: nameSchema,
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ===========================
// CHAT SCHEMAS
// ===========================

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message is too long (max 5000 characters)")
    .trim()
    .transform((val) => sanitizeString(val)),
});

export const chatFileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"].includes(
          file.type
        ),
      "File type must be JPEG, PNG, GIF, WebP, or PDF"
    ),
});

// ===========================
// PROFILE SCHEMAS
// ===========================

export const updateProfileSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  bio: z
    .string()
    .max(500, "Bio is too long (max 500 characters)")
    .optional()
    .transform((val) => (val ? sanitizeString(val) : val)),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: strongPasswordSchema,
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

// ===========================
// CONTACT/FEEDBACK SCHEMAS
// ===========================

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject is too long")
    .trim()
    .transform((val) => sanitizeString(val)),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long (max 2000 characters)")
    .trim()
    .transform((val) => sanitizeString(val)),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1, "Please provide a rating").max(5, "Rating must be between 1 and 5"),
  feedback: z
    .string()
    .min(1, "Feedback is required")
    .min(10, "Feedback must be at least 10 characters")
    .max(1000, "Feedback is too long (max 1000 characters)")
    .trim()
    .transform((val) => sanitizeString(val)),
  email: emailSchema.optional(),
});

// ===========================
// TYPE EXPORTS
// ===========================

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
export type ChatFileUploadFormData = z.infer<typeof chatFileUploadSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;

// ===========================
// VALIDATION HELPERS
// ===========================

/**
 * Validate data against a schema and return formatted errors
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }
    
    const errors: Record<string, string> = {};
    result.error.errors.forEach((error) => {
      const path = error.path.join(".");
      errors[path] = error.message;
    });
    
    return {
      success: false,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      errors: { _global: "Validation failed" },
    };
  }
}

/**
 * Async validation wrapper
 */
export async function validateDataAsync<T>(schema: z.ZodSchema<T>, data: unknown): Promise<{
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}> {
  return validateData(schema, data);
}
