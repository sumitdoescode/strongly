import { z } from "zod";

export const addMemberSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long").max(30, "Full name must not be more than 30 characters long"),
    gymCode: z.string().min(3, "Gym code must be at least 3 characters long").max(10, "Gym code must not be more than 10 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 digits long").max(10, "Phone number must not be more than 10 digits long").optional(),
});

export const updateMemberSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long").max(30, "Full name must not be more than 30 characters long"),
    gymCode: z.string().min(3, "Gym code must be at least 3 characters long").max(10, "Gym code must not be more than 10 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 digits long").max(10, "Phone number must not be more than 10 digits long").optional(),
});

export const completeProfileSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long").max(30, "Full name must not be more than 30 characters long"),
    gymCode: z.string().min(3, "Gym code must be at least 3 characters long").max(10, "Gym code must not be more than 10 characters long"),
});

export const updateProfileSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long").max(30, "Full name must not be more than 30 characters long"),
    gymCode: z.string().min(3, "Gym code must be at least 3 characters long").max(10, "Gym code must not be more than 10 characters long"),
});
