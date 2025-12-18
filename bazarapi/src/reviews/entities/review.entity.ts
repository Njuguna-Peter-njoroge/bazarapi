/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ratings: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

@ManyToOne(() =>UserEntity,(user) => user.reviews)
user:UserEntity;

@ManyToOne( ()=> ProductEntity,(prod) =>prod.reviews)
product:ProductEntity;
}
