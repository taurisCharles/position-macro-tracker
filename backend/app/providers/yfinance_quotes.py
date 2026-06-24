from app.providers.interfaces import Quote, QuoteProvider


class YFinanceQuoteProvider(QuoteProvider):
    """Free best-effort quote provider placeholder."""

    def get_quote(self, symbol: str) -> Quote:
        raise NotImplementedError("Install provider extras and wire yfinance quote retrieval.")

