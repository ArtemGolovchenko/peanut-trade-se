import { Injectable, NotFoundException } from '@nestjs/common';
import { EstimateCurrencyDto } from './dto/estimateCurrency.dto';
import { GetRatesDto } from './dto/getRates.dto';
import axios from 'axios';

@Injectable()
export class AppService {

  KuCoinBaseUrl = "https://api.kucoin.com";
  binanceBaseUrl = "https://api.binance.com";

  async estimate(currency: EstimateCurrencyDto) {
    const exchangeArr = [];

    const kuCoinPrice = await this.getKuCoinPrice(currency.inputCurrency, currency.outputCurrency);

    const binancePrice = await this.getBinancePrice(currency.inputCurrency, currency.outputCurrency);

    const kuCoinExchangePrice = +kuCoinPrice * currency.inputAmount;
    const binanceExchangePrice = +binancePrice * currency.inputAmount;

    const kuCoinObj = {
      exchangeName: "kuCoin",
      outputAmount: kuCoinExchangePrice
    };
    exchangeArr.push(kuCoinObj);

    const binanceObj = {
      exchangeName: "binance",
      outputAmount: binanceExchangePrice
    };
    exchangeArr.push(binanceObj);

    const res = exchangeArr.reduce(function (prev, current) {
      return (prev && prev.outputAmount < current.outputAmount) ? prev : current
    })

    return res;
  }

  async getKuCoinPrice(inputCurrency: string, outputCurrency: string) {
    let kuCoinPrice: number;
    const res = await axios.get(
      `${this.KuCoinBaseUrl}/api/v1/market/orderbook/level1?symbol=${inputCurrency}-${outputCurrency}`,
    );
    if (res.data.data == null) {
      const res = await axios.get(`${this.KuCoinBaseUrl}/api/v1/market/orderbook/level1?symbol=${outputCurrency}-${inputCurrency}`);
      if (res.data.data == null) {
        return "Invalid currencies";
      }
      kuCoinPrice = 1 / res.data.data.price;
      return kuCoinPrice;
    }
    kuCoinPrice = res.data.data.price;
    return kuCoinPrice;
  }

  async getBinancePrice(inputCurrency: string, outputCurrency: string) {
    try {
    let binancePrice: number;
    const res = await axios.get(
      `${this.binanceBaseUrl}/api/v3/ticker/price?symbol=${inputCurrency}${outputCurrency}`, {
      validateStatus: () => true
    });
    if (!res.data.price) {
      const res = await axios.get(`${this.binanceBaseUrl}/api/v3/ticker/price?symbol=${outputCurrency}${inputCurrency}`, {
        validateStatus: () => true
      });
      if (!res.data.price) {
        throw new Error("Invalid currencies");
      }
      binancePrice = 1 / res.data.price;
      return binancePrice;
    }
    binancePrice = res.data.price;
    return binancePrice;
  } catch (e) { throw new NotFoundException(e.message); }
}

  async getRates(rates: GetRatesDto) {
    const kuCoinPrice = await this.getKuCoinPrice(rates.baseCurrency, rates.quoteCurrency);
    const binancePrice = await this.getBinancePrice(rates.baseCurrency, rates.quoteCurrency);

    return {} =
      [
        { exchangeName: "kuCoin", rate: kuCoinPrice },
        { exchangeName: "binance", rate: binancePrice }
      ];
  }

}
