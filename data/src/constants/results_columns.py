class OriginalResultsColumn:
    EVENT_ID = "EventId"


RESULTS_HEADERS = [
    OriginalResultsColumn.EVENT_ID,
    "Rank",
    "Performance",
    "Surname, first name",
    "Club",
    "Nat.",
    "YOB",
    "M/F",
    "Rank M/F",
    "Cat",
    "Cat. Rank",
    "hours",
    "Age graded performance",
]


class ResultsColumn:
    EVENT_ID = "eventId"
    EVENT_RANK = "eventRankNoOverlap"
    DISTANCE = "distanceKm"
    FULL_NAME = "name"
    FIRST_NAME = "firstName"
    LAST_NAME = "lastName"
    NAT3 = "nat3"
    GENDER = "gender"
    YARDS = "yards"
    EVENT_NAME = "race"
    DATE = "date"
    PERSON_ID = "personId"
    ALL_TIME_RANK = "rankResultAllTime"
    EVENT_RANK = "eventRank"
    EVENT_PLACE = "eventPlace"
    IS_TIED_WIN = "isTiedWin"
    IS_PERSONAL_BEST = "isPersonalBest"
    SEASON_BESTS = "seasonBests"
    EVENT_NAT2 = "eventNat2"
    EVENT_NAT3 = "eventNat3"
    EVENT_NAT_FULL = "eventNatFull"
    SEASON = "season"
    AWARD_WON = "awardWon"


RESULTS_COLUMNS_TO_RENAME = {
    OriginalResultsColumn.EVENT_ID: ResultsColumn.EVENT_ID,
    "Rank": ResultsColumn.EVENT_RANK,
    "Performance": ResultsColumn.DISTANCE,
    "Surname, first name": ResultsColumn.FULL_NAME,
    "Nat.": ResultsColumn.NAT3,
    "M/F": ResultsColumn.GENDER,
    "hours": ResultsColumn.YARDS,
    "Event": ResultsColumn.EVENT_NAME,
    "Date": ResultsColumn.DATE,
    "Club": "club",
    "YOB": "birthday",
    "Rank M/F": "genderRank",
    "Cat": "category",
    "Cat. Rank": "categoryRank",
    "Age graded performance": "ageGradedPerformance",
    "Distance": "eventDistance",
    "Finishers": "eventFinishers",
    "IAU-Label": "iauLabel",
}

RESULTS_COLUMNS_TO_DROP = [
    "club",
    "birthday",
    "genderRank",
    "category",
    "categoryRank",
    "ageGradedPerformance",
    "eventDistance",
    "eventFinishers",
    "iauLabel",
]

RESULTS_COLUMNS_TO_SORT_BY = [
    ResultsColumn.YARDS,
    ResultsColumn.EVENT_PLACE,
    ResultsColumn.EVENT_RANK,
    ResultsColumn.DATE,
]
