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
import { Roles } from '../../Utility/common/user-roles.enum';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => CategoryEntity, (cat) => cat.addedBy)
  categories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.addedBy)
  products: ProductEntity[];

  @ManyToOne(() => UserEntity, (user) => user.products)
  addedBy: UserEntity;


@OneToMany(() => ReviewEntity, (review) => review.user)
reviews: ReviewEntity[];

@OneToMany(()=>OrderEntity,(order)=>order.updatedBy)
ordersUpdatedBy:OrderEntity[];

@OneToMany(()=>OrderEntity,(order)=>order.user)
orders:OrderEntity[];
}
