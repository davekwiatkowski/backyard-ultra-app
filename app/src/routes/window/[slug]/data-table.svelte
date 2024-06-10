<script lang="ts">
    import { Render, Subscribe, createTable } from "svelte-headless-table";
    import {
        addPagination,
        addTableFilter,
    } from "svelte-headless-table/plugins";
    import * as Table from "$lib/components/ui/table";
    import { readable } from "svelte/store";
    import type { IRanking } from "../../../types/IRanking";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";

    export let data: IRanking[];

    const table = createTable(readable(data), {
        page: addPagination(),
        filter: addTableFilter({
            fn: ({ filterValue, value }) =>
                value.toLowerCase().includes(filterValue.toLowerCase()),
        }),
    });
    const columns = table.createColumns([
        table.column({
            accessor: "rank",
            header: "Rank",
        }),
        table.column({
            accessor: "name",
            header: "Name",
        }),
        table.column({
            accessor: "nationality",
            header: "Nationality",
        }),
        table.column({
            accessor: "race",
            header: "Race",
        }),
        table.column({
            accessor: "yards",
            header: "Yards",
        }),
        table.column({
            accessor: "date",
            header: "Date",
        }),
    ]);
    const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
        table.createViewModel(columns);
    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
</script>

<div>
    <div class="flex items-center py-4">
        <Input
            class="max-w-sm"
            placeholder="Search"
            type="text"
            bind:value={$filterValue}
        />
    </div>
    <div class="rounded-md border">
        <Table.Root {...$tableAttrs}>
            <Table.Header>
                {#each $headerRows as headerRow}
                    <Subscribe rowAttrs={headerRow.attrs()}>
                        <Table.Row>
                            {#each headerRow.cells as cell (cell.id)}
                                <Subscribe
                                    attrs={cell.attrs()}
                                    let:attrs
                                    props={cell.props()}
                                >
                                    <Table.Head {...attrs}>
                                        <Render of={cell.render()} />
                                    </Table.Head>
                                </Subscribe>
                            {/each}
                        </Table.Row>
                    </Subscribe>
                {/each}
            </Table.Header>
            <Table.Body {...$tableBodyAttrs}>
                {#each $pageRows as row (row.id)}
                    <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                        <Table.Row {...rowAttrs}>
                            {#each row.cells as cell (cell.id)}
                                <Subscribe attrs={cell.attrs()} let:attrs>
                                    <Table.Cell {...attrs}>
                                        <Render of={cell.render()} />
                                    </Table.Cell>
                                </Subscribe>
                            {/each}
                        </Table.Row>
                    </Subscribe>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
    <div class="flex items-center justify-end space-x-4 py-4">
        <Button
            variant="outline"
            size="sm"
            on:click={() => ($pageIndex = $pageIndex - 1)}
            disabled={!$hasPreviousPage}>Previous</Button
        >
        <Button
            variant="outline"
            size="sm"
            disabled={!$hasNextPage}
            on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
        >
    </div>
</div>
