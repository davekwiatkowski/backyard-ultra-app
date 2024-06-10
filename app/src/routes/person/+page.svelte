<script lang="ts">
    import { base } from "$app/paths";

    export let data;
</script>

<p>Note: Only contains rankings for efforts at least 24 yards.</p>

<hr />

<strong>Person:</strong>
<div class="personKeys">
    {#each data.personKeys as personKey}
        <a class={"personKey"} href={`${base}/person/${personKey}`}>
            {personKey}
        </a>
    {/each}
</div>

<style>
    .personKeys {
        display: flex;
        flex-wrap: wrap;
        flex: row;
    }
    .personKey {
        padding: 0.25rem;
    }
</style>
