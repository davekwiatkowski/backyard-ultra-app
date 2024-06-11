<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { Button } from "$lib/components/ui/button/index.js";

    export let data;
</script>

<strong>Date window:</strong>
<div class="keys">
    {#each data.windowKeys as key}
        <Button variant="link" on:click={() => goto(`${base}/window/${key}`)}>
            {key}
        </Button>
    {/each}
</div>

<slot />

<style>
    .keys {
        display: flex;
        flex-wrap: wrap;
        flex: row;
    }
</style>
