import { signUpAction } from '$lib/server';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = { default: signUpAction };
