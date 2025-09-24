import * as fs from 'fs';
import * as path from 'path';

export interface CurrencyRates {
  date: string;
  usd: Record<string, number>;
}

export interface ConvertedPrice {
  original: string;
  originalCurrency: string;
  converted: number;
  convertedFormatted: string;
}

export class CurrencyConverter {
  private rates: CurrencyRates | null = null;
  private static instance: CurrencyConverter;

  static getInstance(): CurrencyConverter {
    if (!CurrencyConverter.instance) {
      CurrencyConverter.instance = new CurrencyConverter();
    }
    return CurrencyConverter.instance;
  }

  async loadRates(): Promise<void> {
    const ratesPath = path.join(process.cwd(), 'currency-rates.json');
    
    // Try to load from local file first (for dev builds)
    if (fs.existsSync(ratesPath)) {
      try {
        const localRates = JSON.parse(fs.readFileSync(ratesPath, 'utf8'));
        this.rates = localRates;
        console.log(`[CurrencyConverter] Loaded rates from local file (${localRates.date})`);
        return;
      } catch (error) {
        console.warn('[CurrencyConverter] Failed to load local rates, fetching from API');
      }
    }

    // Fetch from API
    try {
      console.log('[CurrencyConverter] Fetching latest currency rates...');
      const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.rates = await response.json();
      
      // Save to local file for future dev builds
      fs.writeFileSync(ratesPath, JSON.stringify(this.rates, null, 2));
      console.log(`[CurrencyConverter] Fetched and saved rates (${this.rates?.date})`);
    } catch (error) {
      console.error('[CurrencyConverter] Failed to fetch rates:', error);
      // Fallback to a basic set of common currencies
      this.rates = {
        date: new Date().toISOString().split('T')[0],
        usd: {
          usd: 1,
          eur: 0.85,
          gbp: 0.73,
          jpy: 148,
          cny: 7.1,
          cad: 1.38,
          aud: 1.51,
          chf: 0.79,
          krw: 1394,
          inr: 88,
          brl: 5.3,
          mxn: 18.4,
          rub: 83.3,
          try: 41.4,
          zar: 17.4,
          sek: 9.36,
          nok: 9.89,
          dkk: 6.34,
          pln: 3.62,
          czk: 20.6,
          huf: 330.8,
          ron: 4.3,
          bgn: 1.66,
          hrk: 6.4,
          rsd: 99.5,
          uah: 41.2,
          byn: 3.39,
          kzt: 541,
          uzs: 12314,
          kgs: 87.5,
          tjs: 9.38,
          tmt: 3.5,
          afn: 67.3,
          pkr: 283.1,
          lkr: 302,
          bdt: 121.7,
          npr: 141.2,
          mmk: 2099,
          thb: 31.9,
          lak: 21666,
          khr: 4006,
          vnd: 26388,
          idr: 16570,
          myr: 4.21,
          sgd: 1.28,
          php: 57.2,
          twd: 30.2,
          hkd: 7.78,
          mop: 8.01,
          aed: 3.67,
          sar: 3.75,
          qar: 3.64,
          kwd: 0.31,
          bhd: 0.38,
          omr: 0.38,
          jod: 0.71,
          ils: 3.34,
          egp: 48.2,
          lyd: 5.4,
          tnd: 2.9,
          dzd: 129.4,
          mad: 9.01,
          mru: 39.9,
          xof: 557,
          xaf: 557,
          gnf: 8668,
          lrd: 177.8,
          sll: 22805,
          ghs: 12.3,
          ngn: 1495,
          cdf: 2766,
          rwf: 1446,
          ugx: 3502,
          tzs: 2473,
          kes: 129.4,
          etb: 143.6,
          djf: 178,
          sos: 571,
          mwk: 1734,
          zmw: 23.7,
          bwp: 14.2,
          szl: 17.4,
          lsl: 17.4,
          nad: 17.4,
          aoa: 915,
          mzn: 63.9
        }
      };
      console.log('[CurrencyConverter] Using fallback rates');
    }
  }

  convertPrice(amount: number, fromCurrency: string): ConvertedPrice {
    if (!this.rates) {
      throw new Error('Currency rates not loaded');
    }

    const fromCurrencyUpper = fromCurrency.toUpperCase();
    const rate = this.rates.usd[fromCurrencyUpper.toLowerCase()];
    
    if (!rate) {
      console.warn(`[CurrencyConverter] Unknown currency: ${fromCurrency}`);
      return {
        original: amount.toString(),
        originalCurrency: fromCurrency,
        converted: amount,
        convertedFormatted: `$${Math.round(amount)}`
      };
    }

    // Convert to USD (divide by rate since rates are USD to other currency)
    const converted = amount / rate;
    const rounded = Math.round(converted);

    return {
      original: amount.toString(),
      originalCurrency: fromCurrency,
      converted: rounded,
      convertedFormatted: `$${rounded}`
    };
  }

  convertPriceString(priceStr: string, currency: string): ConvertedPrice {
    // Extract numeric value from price string
    const numericMatch = priceStr.match(/[\d,]+\.?\d*/);
    if (!numericMatch) {
      // If no numeric value found (e.g., "Varies", "Contact", etc.), return original
      return {
        original: priceStr,
        originalCurrency: currency,
        converted: 0,
        convertedFormatted: priceStr
      };
    }

    const numericStr = numericMatch[0].replace(/,/g, '');
    const amount = parseFloat(numericStr);
    
    if (isNaN(amount)) {
      // If numeric value is invalid, return original
      return {
        original: priceStr,
        originalCurrency: currency,
        converted: 0,
        convertedFormatted: priceStr
      };
    }

    return this.convertPrice(amount, currency);
  }

  getRates(): CurrencyRates | null {
    return this.rates;
  }
}

export function getCurrencyConverter(): CurrencyConverter {
  return CurrencyConverter.getInstance();
}
