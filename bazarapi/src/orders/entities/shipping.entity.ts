/* eslint-disable prettier/prettier */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity({name:'shipppings'})
export class ShippingEntity {
      @PrimaryGeneratedColumn()
      id:number;

      @Column()
      phone:string;


      @Column({default:''})

      name:string;

      @Column()
      address:string;

      @Column()
            city:string;

            @Column()
            postcode:string;


@Column()
state:string;

            @Column()
            country:string;

@OneToOne(() =>OrderEntity,(order)=>order.ShippingAddress)
order:OrderEntity;

      
}