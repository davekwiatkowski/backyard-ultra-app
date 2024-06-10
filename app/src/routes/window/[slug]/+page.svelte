<script lang="ts">
    import { base } from "$app/paths";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<ul>
    {#each data.windowRankingsData as item}
        <li>
            <span>Rank {item.rank}</span>
            {#if item.isRankTied}
                <span>(tie)</span>
            {/if}
            |
            <a href={`${base}/person/${item.id}`}>
                <span>{item.name}</span>
                {#if item.nationality}
                    <span>({item.nationality})</span>
                {/if}
            </a>
            |
            <span>{item.race}</span>
            |
            <span>{item.yards} yards</span>
            (<span>{item.date}</span>)
        </li>
    {/each}
</ul>
