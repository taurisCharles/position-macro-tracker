from dataclasses import dataclass


@dataclass(frozen=True)
class XFeedTopic:
    name: str
    query: str
    use: str


DEFAULT_X_TOPICS = [
    XFeedTopic(
        name="volatility",
        query='(VIX OR VVIX OR "vol control" OR volatility) lang:en -is:retweet',
        use="Volatility narrative around entry and monitoring dates.",
    ),
    XFeedTopic(
        name="rates",
        query='("10Y" OR "Treasury yields" OR "yield curve" OR Fed) lang:en -is:retweet',
        use="Rates and Fed narrative.",
    ),
    XFeedTopic(
        name="oil_gas",
        query='(WTI OR "Henry Hub" OR crude OR natural gas OR EIA) lang:en -is:retweet',
        use="Oil and gas market narrative.",
    ),
    XFeedTopic(
        name="position_watchlist",
        query='({symbols}) lang:en -is:retweet',
        use="Position-specific narrative for manually tracked symbols.",
    ),
]


class XFeedProvider:
    """Optional X API social-feed descriptor.

    Read access is not assumed to be free. Use only when the user supplies an
    X bearer token and explicitly enables social-feed pulls.
    """

    def topics(self) -> list[XFeedTopic]:
        return DEFAULT_X_TOPICS

