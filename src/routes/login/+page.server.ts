import { loginAction } from '$lib/server/actions/login';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = { default: loginAction };
