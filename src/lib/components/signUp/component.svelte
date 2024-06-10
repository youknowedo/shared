<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label for="givenName">Given Name</label>
	<input name="givenName" id="givenName" /><br />
	<label for="surname">Surname</label>
	<input name="surname" id="surname" /><br />
	<label for="email">Email</label>
	<input name="email" id="email" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<button>Continue</button>
</form>
