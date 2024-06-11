import type { Actions } from '@sveltejs/kit';
import { signUpAction, signUpServerLoad } from '../../lib/server';

export const load = signUpServerLoad;

export const actions: Actions = { default: signUpAction };
