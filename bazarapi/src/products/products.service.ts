import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { UserEntity } from '../users/entities/user.entity';
import { orderStatus } from 'src/orders/ENUMS/order-status.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(
      +createProductDto.categoriesId,
    );
    const product = this.productRepository.create(createProductDto);
    product.categories = category;
    product.addedBy = currentUser;
    return await this.productRepository.save(product);
  }

  findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
        categories: true,
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        categories: {
          id: true,
          title: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    // (+updateProductDto.categoriesId, (product.addedBy = currentUser));
    product.addedBy = currentUser;
    if (updateProductDto.categoriesId) {
      const category = await this.categoryService.findOne(
        +updateProductDto.categoriesId,
      );
      product.categories = category;
    }
    return this.productRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async updateStock(id: number, stock: number, status: string) {
    const product = await this.findOne(id);
    if (status === orderStatus.DELIVERED) {
      product.stock -= stock;
    } else {
      product.stock += stock;
    }
    await this.productRepository.save(product);

    return product;
  }
}
