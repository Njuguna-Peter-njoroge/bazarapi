/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ordersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports:[TypeOrmModule.forFeature([OrderEntity,ordersProductsEntity,ShippingEntity,]),ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService
  ],
})
export class OrdersModule {}
