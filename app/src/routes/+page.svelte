<script>
    /** @type {import('./$types').LayoutData} */
    export let data;

    const dateWindowKeys = Object.keys(data.dateWindowRankingsData);

    let currentDateWindowKey = dateWindowKeys[0];
</script>

<h1>backyardultra.app</h1>
<p>Backyard ultra rankings for runners who have run at least 24 yards.</p>

<hr />

<h3>Date window:</h3>
{#each dateWindowKeys as dateWindowKey}
    <label>
        <input
            type="radio"
            name="dateWindowKey"
            value={dateWindowKey}
            bind:group={currentDateWindowKey}
        />
        {dateWindowKey}
    </label>
{/each}

<hr />

<ul>
    {#each data.dateWindowRankingsData[currentDateWindowKey] as item}
        <li>
            <span>Rank {item.rank}</span>
            {#if item.isRankTied}
                <span>(tie)</span>
            {/if}
            |
            <a href={`/person/${item.id}`}>
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
