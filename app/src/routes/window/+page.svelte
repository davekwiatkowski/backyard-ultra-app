<script lang="ts">
    import { base } from "$app/paths";

    export let data;
</script>

<strong>Date window:</strong>
<div class="flex flex-wrap flex-row">
    {#each data.windowKeys as key}
        <a class="p-2" href={`${base}/window/${key}`}>{key}</a>
    {/each}
</div>
