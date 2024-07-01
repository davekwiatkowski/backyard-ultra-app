from src.constants.results_columns import RESULTS_COLUMNS_TO_SORT_BY, ResultsColumn


def add_team_status(results_df, season):
    # Anyone with a silver ticket is on the team
    results_df.loc[
        results_df[ResultsColumn.SEASONS].apply(lambda x: season in x)
        & (results_df[ResultsColumn.AWARD_WON] == "Silver"),
        ResultsColumn.TEAM_STATUS,
    ] = "Silver ticket"

    # Put the silver tickets at the top of country
    results_df = results_df.sort_values(
        by=[ResultsColumn.TEAM_STATUS] + RESULTS_COLUMNS_TO_SORT_BY,
        ascending=[False, False, False, True, True],
    )

    # Give a spot to the top 15 spots (including the silver tickets) a spot
    results_df["resultId"] = results_df.index
    selection = (
        results_df[
            results_df[ResultsColumn.SEASONS].apply(lambda x: season in x)
            & (
                results_df[ResultsColumn.SEASON_BESTS].apply(lambda x: season in x)
                | results_df[ResultsColumn.TEAM_STATUS]
            )
        ]
        .drop_duplicates(subset=[ResultsColumn.PERSON_ID])
        .groupby(ResultsColumn.NAT3)
    )
    results_df.loc[
        results_df["resultId"].isin(selection.head(21)["resultId"].values.tolist()),
        ResultsColumn.TEAM_STATUS,
    ] = "Alternate"
    results_df.loc[
        results_df["resultId"].isin(selection.head(15)["resultId"].values.tolist()),
        ResultsColumn.TEAM_STATUS,
    ] = "At-large"
    results_df.loc[
        results_df[ResultsColumn.SEASONS].apply(lambda x: season in x)
        & (results_df[ResultsColumn.AWARD_WON] == "Silver"),
        ResultsColumn.TEAM_STATUS,
    ] = "Silver ticket"
    results_df = results_df.drop(columns=["resultId"])

    # Apply the original sorting
    results_df = results_df.sort_values(
        by=RESULTS_COLUMNS_TO_SORT_BY,
        ascending=[False, False, True, True],
    )

    return results_df
