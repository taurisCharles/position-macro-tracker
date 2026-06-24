from dataclasses import dataclass


@dataclass(frozen=True)
class MultplMetric:
    slug: str
    label: str
    url: str
    category: str


MULTPL_METRICS = {
    "sp500_pe": MultplMetric(
        slug="s-p-500-pe-ratio",
        label="S&P 500 P/E Ratio",
        url="https://www.multpl.com/s-p-500-pe-ratio",
        category="valuation",
    ),
    "shiller_pe": MultplMetric(
        slug="shiller-pe",
        label="Shiller PE Ratio",
        url="https://www.multpl.com/shiller-pe",
        category="valuation",
    ),
    "sp500_dividend_yield": MultplMetric(
        slug="s-p-500-dividend-yield",
        label="S&P 500 Dividend Yield",
        url="https://www.multpl.com/s-p-500-dividend-yield",
        category="valuation",
    ),
    "sp500_earnings_yield": MultplMetric(
        slug="s-p-500-earnings-yield",
        label="S&P 500 Earnings Yield",
        url="https://www.multpl.com/s-p-500-earnings-yield",
        category="valuation",
    ),
}


class MultplValuationProvider:
    """Multpl valuation source descriptor.

    Multpl is valuable for valuation history, but it is not treated as a formal
    API provider in this app. Use it with local caching, attribution, and manual
    review before relying on values in a thesis snapshot.
    """

    def catalog(self) -> list[MultplMetric]:
        return list(MULTPL_METRICS.values())

