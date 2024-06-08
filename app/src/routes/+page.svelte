<script>
    /** @type {import('./$types').LayoutData} */
    export let data;
</script>

<h1>backyardultra.app</h1>
<p>The backyard ultra app</p>

<ul>
    {#each data.backyardUltraRankings as item}
        <li>
            <span>{item.date}</span>
            |
            <span>{item.race}</span>
            |
            <span>{item.name}</span>
            |
            <span>{item.yards} yards</span>
            |
            <span>({item.window})</span>
        </li>
    {/each}
</ul>
