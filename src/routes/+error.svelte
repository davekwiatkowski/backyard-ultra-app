<script lang='ts'>
	import { page } from '$app/stores';
</script>

<style>
	.status {
		color: red
	}
</style>

<h1 class='title'>Uh oh! There was an error...</h1>
<h2 class='status'>{$page.status}</h2>
<p>{$page.error?.message}</p>