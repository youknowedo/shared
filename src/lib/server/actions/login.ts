import { db, users } from '$lib/server';
import { isValidEmail, lucia } from '$lib/server/auth';
import { fail, redirect, type Action } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const loginAction: Action = async (event) => {
	const formData = await event.request.formData();
	const email = formData.get('email');
	const password = formData.get('password');

	if (typeof email !== 'string' || !isValidEmail(email)) {
		return fail(400, {
			message: 'Invalid email'
		});
	}
	if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
		return fail(400, {
			message: 'Invalid password'
		});
	}

	const existingUser = await db
		.select()
		.from(users)
		.where(eq(users.email, email.toLowerCase()))?.[0];

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

	const validPassword = await Bun.password.verify(existingUser.password_hash, password, 'argon2id');
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

	redirect(302, '/');
};
