import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, position: 'prefix' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, position: 'prefix' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, position: 'prefix' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, position: 'prefix' },
  PKR: { code: 'PKR', symbol: '₨ ', rate: 278.5, position: 'prefix' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.36, position: 'prefix' },
};

export function formatPrice(amountInUSD: number, currencyCode: CurrencyCode = 'USD'): string {
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.USD;
  const converted = amountInUSD * config.rate;
  
  const formattedNumber = converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return config.position === 'prefix'
    ? `${config.symbol}${formattedNumber}`
    : `${formattedNumber} ${config.symbol}`;
}
