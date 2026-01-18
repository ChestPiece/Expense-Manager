"use client";

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencySelectorProps {
  currency: string;
  currencies: Currency[];
  onCurrencyChange: (code: string) => void;
  loading?: boolean;
}

export function CurrencySelector({
  currency,
  currencies,
  onCurrencyChange,
  loading,
}: CurrencySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {/* <Label htmlFor="currency-select" className="sr-only">Currency</Label> */}
      <div className="relative w-full sm:w-[200px]">
        {loading ? (
          <div className="h-10 w-full animate-pulse bg-muted border-2 border-border" />
        ) : (
          <select
            id="currency"
            className="flex h-10 w-full rounded-none border-2 border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 retro-shadow focus:retro-shadow-active transition-all font-mono font-bold"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
