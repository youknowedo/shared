import { Cookies, fail, redirect, type Action } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { isValidEmail, lucia } from '../auth';

export const logout = async (sessionId: string, cookies: Cookies) => {
	await lucia.invalidateSession(sessionId);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};
