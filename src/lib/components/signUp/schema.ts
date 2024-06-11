import { z } from 'zod';

export const formSchema = z.object({
	givenName: z.string().min(1).max(255),
	surname: z.string().min(1).max(255),
	email: z
		.string()
		.email()
		.regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
	password: z.string().min(6).max(255)
});

export type FormSchema = typeof formSchema;
