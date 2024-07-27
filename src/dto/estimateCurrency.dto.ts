import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class EstimateCurrencyDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  inputAmount: number;

  @IsString()
  @IsNotEmpty()
  inputCurrency: string;

  @IsString()
  @IsNotEmpty()
  outputCurrency: string;
}