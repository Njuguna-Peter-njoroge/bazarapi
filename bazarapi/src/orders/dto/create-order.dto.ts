import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateShippingDto } from './createShipping.dto';
import { OrderProductsDto } from './order-products.dto';

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductsDto)
  orderProducts: OrderProductsDto[];
}
