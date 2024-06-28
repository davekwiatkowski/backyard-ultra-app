from src.constants.results_columns import ResultsColumn


class EventTicketsColumn:
    EVENT_NAT_FULL = ResultsColumn.EVENT_NAT_FULL
    TICKET_TYPE = "ticketType"
    EVENT_NAME = ResultsColumn.EVENT_NAME
    DATE = ResultsColumn.DATE
    RACE_QUALIFIED_FOR = "raceQualifiedFor"


EVENT_TICKETS_COLUMNS_TO_RENAME = {
    "Country": EventTicketsColumn.EVENT_NAT_FULL,
    "Bronze/Silver": EventTicketsColumn.TICKET_TYPE,
    "Backyard Race": EventTicketsColumn.EVENT_NAME,
    "Date": EventTicketsColumn.DATE,
    "Pod": EventTicketsColumn.RACE_QUALIFIED_FOR,
}
