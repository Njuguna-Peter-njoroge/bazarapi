import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity({ name: 'category' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.categories)
  addedBy: UserEntity;

  @OneToMany(() => ProductEntity, (prod) => prod.categories)
  products: ProductEntity[];
}
