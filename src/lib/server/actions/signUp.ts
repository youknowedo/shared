import { fail, redirect, type Action } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { isValidEmail, lucia } from '../../server/auth';
import { db } from '../../server/db';
import { users } from '../../server/schema';

export const signUpAction: Action = async (event) => {
	const formData = await event.request.formData();
	const givenName = formData.get('givenName');
	const surname = formData.get('surname');
	const email = formData.get('email');
	const password = formData.get('password');

	if (typeof givenName !== 'string' || givenName.length > 255) {
		return fail(400, {
			message: 'Invalid given name'
		});
	}

	if (typeof surname !== 'string' || surname.length > 255) {
		return fail(400, {
			message: 'Invalid surname'
		});
	}

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

	const id = generateIdFromEntropySize(10); // 16 characters long
	const passwordHash = await Bun.password.hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		algorithm: 'argon2id'
	});

	// TODO: check if email is already used
	await db.insert(users).values({
		id,
		givenName,
		surname,
		email,
		passwordHash
	});

	const session = await lucia.createSession(id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	redirect(302, '/');
};
