import { z } from 'zod';

export const UUIDSchema = z.uuid("Invalid ID");

export type UUIDInput = z.infer<typeof UUIDSchema>;