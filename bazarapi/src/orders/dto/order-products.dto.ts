import { IsPositive } from 'class-validator';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderProductsDto {
  @IsNotEmpty({ message: 'product cannot be empty' })
  id: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price should be number & ma decimal precision 2 ' },
  )
  @IsPositive({ message: 'price cannot be negative' })
  product_unit_price: number;

  @IsNumber(
    {},
    { message: 'product_quantity should be number & ma decimal precision 2 ' },
  )
  @IsPositive({ message: 'product_quantity cannot be negative' })
  product_quantity: number;
}
