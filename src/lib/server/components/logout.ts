import { fail, redirect, type Action } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { isValidEmail, lucia } from '../auth';

export const logoutAction: Action = async (event) => {
	if (!event.locals.session) {
		return fail(401);
	}
	await lucia.invalidateSession(event.locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	redirect(302, '/login');
};
