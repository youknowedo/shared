import { handleHooks } from '$lib/server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = handleHooks;
