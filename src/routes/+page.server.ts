import { logoutAction } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');
	return {
		email: event.locals.user.email
	};
};

export const actions: Actions = {
	default: logoutAction
};
