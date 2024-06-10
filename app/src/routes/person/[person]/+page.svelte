<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;

    const currentPerson = data.personRankingsData[data.currentPersonId][0];
</script>

<a href="/">Back</a>

<h1>{currentPerson.name} ({currentPerson.nationality})</h1>

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
