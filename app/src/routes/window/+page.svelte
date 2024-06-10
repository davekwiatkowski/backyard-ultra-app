<script lang="ts">
    import { base } from "$app/paths";

    export let data;
</script>

<strong>Date window:</strong>
<div class="keys">
    {#each data.windowKeys as key}
        <a class={"key"} href={`${base}/window/${key}`}>
            {key}
        </a>
    {/each}
</div>

<style>
    .keys {
        display: flex;
        flex-wrap: wrap;
        flex: row;
    }
    .key {
        padding: 0.25rem;
    }
</style>
