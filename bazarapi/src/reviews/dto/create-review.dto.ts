/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {

@IsNotEmpty({message:'product should not be empty'})
@IsNumber({},{message:'productId should  be string'})

      productId:number;

      @IsNotEmpty({message:'ratings should not be empty'})
      @IsNumber({})

      ratings:number;

@IsNotEmpty({message:'ratings should not be empty'})
@IsString()
      comment:string;
}
