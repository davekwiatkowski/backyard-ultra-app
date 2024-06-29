from src.constants.results_columns import ResultsColumn


class TicketEventsColumn:
    EVENT_NAT_FULL = ResultsColumn.EVENT_NAT_FULL
    TICKET_TYPE = "ticketType"
    EVENT_NAME = ResultsColumn.EVENT_NAME
    DATE = ResultsColumn.DATE
    RACE_QUALIFIED_FOR = "raceQualifiedFor"


TICKET_EVENTS_COLUMNS_TO_RENAME = {
    "Country": TicketEventsColumn.EVENT_NAT_FULL,
    "Bronze/Silver": TicketEventsColumn.TICKET_TYPE,
    "Backyard Race": TicketEventsColumn.EVENT_NAME,
    "Date": TicketEventsColumn.DATE,
    "Pod": TicketEventsColumn.RACE_QUALIFIED_FOR,
}
