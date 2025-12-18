import { ordersProductsEntity } from 'src/orders/entities/orders-products.entity';
import { CurrentUser } from './../Utility/Decorators/current-user.decorator';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingEntity } from './entities/shipping.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(ordersProductsEntity)
    private readonly opRepository: Repository<ordersProductsEntity>,
  ) {}
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.ShippingAddress = shippingEntity;
    orderEntity.user = currentUser;

    const order = await this.orderRepository.save(orderEntity);

    const opEntity: {
      orderId: number;
      productId: number;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderProducts.length; i++) {
      const orderId = order.id;
      const productId = createOrderDto.orderProducts[i].id;
      const product_quantity = createOrderDto.orderProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderProducts[i].product_unit_price;
      opEntity.push({
        orderId,
        productId,
        product_quantity,
        product_unit_price,
      });
    }

    const op = await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(ordersProductsEntity)
      .values(opEntity).execute();

    return 
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where:{id},
      relations:{
        ShippingAddress:true,
        user:true,
        products:true,
      }
    })
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
