import { fail, redirect, type Action } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db, users } from '..';
import { formSchema } from '../../components/login/schema';
import { isValidEmail, lucia } from '../auth';
import type { PageServerLoad } from './$types';

export const loginServerLoad: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const loginAction: Action = async (event) => {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	const { email, password } = form.data;

	const existingUser = (
		await db.select().from(users).where(eq(users.email, email.toLowerCase()))
	)?.[0];

	if (!existingUser) {
		// NOTE:
		// Returning immediately allows malicious actors to figure out valid emails from response times,
		// allowing them to only focus on guessing passwords in brute-force attacks.
		// As a preventive measure, you may want to hash passwords even for invalid emails.
		// However, valid emails can be already be revealed with the signup page among other methods.
		// It will also be much more resource intensive.
		// Since protecting against this is non-trivial,
		// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
		// If emails are public, you may outright tell the user that the email is invalid.
		return fail(400, {
			message: 'Incorrect email or password'
		});
	}

	const validPassword = await Bun.password.verify(password, existingUser.passwordHash, 'argon2id');

	if (!validPassword) {
		return fail(400, {
			message: 'Incorrect email or password'
		});
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};
