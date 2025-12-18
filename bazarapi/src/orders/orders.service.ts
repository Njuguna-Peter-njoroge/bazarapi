import { CurrentUser } from './../Utility/Decorators/current-user.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ordersProductsEntity } from 'src/orders/entities/orders-products.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { orderStatus } from './ENUMS/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(ordersProductsEntity)
    private readonly opRepository: Repository<ordersProductsEntity>,
    private readonly productsService: ProductsService,
  ) {}
  async create(
    createOrderDto: CreateOrderDto,
    currentUser: UserEntity,
  ): Promise<OrderEntity> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.ShippingAddress = shippingEntity;
    orderEntity.user = currentUser;

    const OrderTbl = await this.orderRepository.save(orderEntity);

    const opEntity: {
      order: OrderEntity;
      productId: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderProducts.length; i++) {
      const order = OrderTbl;
      const product = await this.productsService.findOne(
        createOrderDto.orderProducts[i].id,
      );
      const product_quantity = createOrderDto.orderProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderProducts[i].product_unit_price;
      opEntity.push({
        order,
        productId: product,
        product_quantity,
        product_unit_price,
      });
      if (!createOrderDto.orderProducts?.length) {
        throw new BadRequestException(
          'Order must contain at least one product',
        );
      }
    }

    const op = await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(ordersProductsEntity)
      .values(opEntity)
      .execute();

    return await this.findOne(OrderTbl.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        ShippingAddress: true,
        user: true,
        products: true,
      },
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        ShippingAddress: true,
        user: true,
        products: true,
      },
    });
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return order;
  }

  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ): Promise<OrderEntity> {
    const order = await this.findOne(id);

    if (
      order.status === orderStatus.DELIVERED ||
      order.status === orderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Order already ${order.status}`);
    }

    if (
      order.status === orderStatus.PROCESSING &&
      updateOrderStatusDto.status === orderStatus.DELIVERED
    ) {
      throw new BadRequestException('Cannot deliver before shipping');
    }

    if (updateOrderStatusDto.status === orderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    if (updateOrderStatusDto.status === orderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;

    await this.orderRepository.save(order);

    if (updateOrderStatusDto.status === orderStatus.DELIVERED) {
      await this.stockUpdate(order, orderStatus.DELIVERED);
    }

    return order;
  }

  async cancelled(id: number, currentUser: UserEntity) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('order bot found');
    }
    if ((order.status = orderStatus.CANCELLED)) {
      return order;
    }

    order.status = orderStatus.CANCELLED;
    order.updatedBy = currentUser;
    await this.orderRepository.save(order);
    await this.stockUpdate(order, orderStatus.CANCELLED);
    return order;
  }
  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productsService.updateStock(
        op.Product.id,
        op.product_quantity,
        status,
      );
    }
  }
}
