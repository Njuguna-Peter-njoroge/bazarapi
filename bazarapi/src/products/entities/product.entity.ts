/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { ordersProductsEntity } from 'src/orders/entities/orders-products.entity';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  stock: number;

  @Column('simple-array')
  image: string[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => UserEntity, (user) => user.products)
  addedBy: UserEntity;

  @ManyToOne(() => CategoryEntity, (cat) => cat.products)
  categories: CategoryEntity;

  @OneToMany(()=>ReviewEntity,(rev) =>rev.product)
  reviews:ReviewEntity[];

  @OneToMany(()=>ordersProductsEntity,(op)=>op.Product) 
  products:ordersProductsEntity[]; 
}
