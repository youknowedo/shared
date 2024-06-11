import type { Actions } from '@sveltejs/kit';
import { loginAction, loginServerLoad } from '../../lib/server';

export const load = loginServerLoad;

export const actions: Actions = { default: loginAction };
