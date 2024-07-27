import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { EstimateCurrencyDto } from './dto/estimateCurrency.dto';
import { GetRatesDto } from './dto/getRates.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('estimate')
  estimate(@Query() currency: EstimateCurrencyDto) {
    return this.appService.estimate(currency);
  }

  @Get('getRates')
  getRates(@Query() rates: GetRatesDto) {
    return this.appService.getRates(rates);
  }

}
