import { fail, redirect, type Action } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '../../components/signUp/schema';
import { isValidEmail, lucia } from '../auth';
import { db } from '../db';
import { users } from '../schema';
import type { PageServerLoad } from './$types';

export const signUpServerLoad: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const signUpAction: Action = async (event) => {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	const { givenName, surname, email, password } = form.data;

	const id = generateIdFromEntropySize(10); // 16 characters long
	const passwordHash = await Bun.password.hash(password);

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
