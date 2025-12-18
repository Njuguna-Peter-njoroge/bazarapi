/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { orderStatus } from "../ENUMS/order-status.enum";
import { UserEntity } from "src/users/entities/user.entity";
import { ShippingEntity } from "./shipping.entity";
import { ordersProductsEntity } from "./orders-products.entity";

@Entity({name:"orders"})

export class OrderEntity {
      @PrimaryGeneratedColumn()
      id:number;

      @CreateDateColumn()
      orderAt:Date;

      @Column({type:'enum',enum:orderStatus,default:orderStatus.PROCESSING})
      status:orderStatus;

      @Column({nullable:true})
      shippedAt:Date;

 @Column({nullable:true}) 
      deliveredAt:Date;

      @ManyToOne(() =>UserEntity,(user)=>user.ordersUpdatedBy)
      updatedBy:UserEntity;

@OneToOne(()=>ShippingEntity,(ship)=>ship.order,{cascade:true})
@JoinColumn()
ShippingAddress:ShippingEntity;

@OneToMany(()=>ordersProductsEntity,(op) =>op.order,{cascade:true})
products:ordersProductsEntity[];

@ManyToOne(()=>UserEntity,(user)=>user.orders)
user:UserEntity;
}
