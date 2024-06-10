<script lang="ts">
    import { base } from "$app/paths";
    import type { PageData } from "./$types";

    export let data: PageData;

    const currentPerson = data.personRankingsData[data.currentPersonId][0];
</script>

<a href={`${base}/`}>Back</a>

<h1>Rankings: {currentPerson.name} ({currentPerson.nationality})</h1>
<p>Note: Only contains rankings for efforts at least 24 yards.</p>

<hr />

<ul>
    {#each data.personRankingsData[data.currentPersonId] as item}
        <li>
            <p>
                {item.window}: Rank {item.rank}
                {#if item.isRankTied}
                    <span>(tie)</span>
                {/if}
            </p>
            <span>{item.yards} yards</span>
            |
            <span>{item.race}</span>
            (<span>{item.date}</span>)
        </li>
    {/each}
</ul>
