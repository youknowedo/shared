<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import '../../styles.css';
	import { formSchema, type FormSchema } from './schema.js';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<h1>Sign Up</h1>

<form method="POST" use:enhance>
	<Form.Field {form} name="givenName">
		<Form.Control let:attrs>
			<Form.Label>Given Name</Form.Label>
			<Input {...attrs} bind:value={$formData.givenName} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="surname">
		<Form.Control let:attrs>
			<Form.Label>Surname</Form.Label>
			<Input {...attrs} bind:value={$formData.surname} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} type="email" bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} type="password" bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
