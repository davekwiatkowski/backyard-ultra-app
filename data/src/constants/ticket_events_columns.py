from src.constants.results_columns import ResultsColumn


class TicketEventsColumn:
    EVENT_NAT_FULL = ResultsColumn.EVENT_NAT_FULL
    EVENT_AWARD = "eventAward"
    EVENT_NAME = ResultsColumn.EVENT_NAME
    DATE = ResultsColumn.DATE
    RACE_QUALIFIED_FOR = "raceQualifiedFor"


TICKET_EVENTS_COLUMNS_TO_RENAME = {
    "Country": TicketEventsColumn.EVENT_NAT_FULL,
    "Bronze/Silver": TicketEventsColumn.EVENT_AWARD,
    "Backyard Race": TicketEventsColumn.EVENT_NAME,
    "Date": TicketEventsColumn.DATE,
    "Pod": TicketEventsColumn.RACE_QUALIFIED_FOR,
}
