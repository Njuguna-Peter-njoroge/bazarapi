import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderEntity } from './entities/order.entity';
import { ordersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      ordersProductsEntity,
      ShippingEntity,
    ]), // only entities
    ProductsModule, // import module here to get ProductsService
  ],
  controllers: [OrdersController],
  providers: [OrdersService], // only provide services defined here
})
export class OrdersModule {}
