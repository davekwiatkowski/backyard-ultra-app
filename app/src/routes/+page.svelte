<script lang="ts">
    import { base } from "$app/paths";

    /** @type {import('./$types').LayoutData} */
    export let data;

    const dateWindowKeys = Object.keys(data.dateWindowRankingsData);

    let currentDateWindow = dateWindowKeys[dateWindowKeys.length - 1];
</script>

<h1>Rankings: {currentDateWindow}</h1>
<p>Note: Only contains rankings for efforts at least 24 yards.</p>

<hr />

<strong>Date window:</strong>
{#each dateWindowKeys as dateWindowKey}
    <label>
        <input
            type="radio"
            name="dateWindowKey"
            value={dateWindowKey}
            bind:group={currentDateWindow}
        />
        {dateWindowKey}
    </label>
{/each}

<hr />

<ul>
    {#each data.dateWindowRankingsData[currentDateWindow] as item}
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
