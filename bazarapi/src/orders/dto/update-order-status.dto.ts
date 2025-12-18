import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { orderStatus } from '../ENUMS/order-status.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([orderStatus.SHIPPED, orderStatus.DELIVERED])
  status: orderStatus;
}
