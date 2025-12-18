import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'phone cannot be empty' })
  @IsString({ message: 'phone format should be string' })
  phone: string;

  @IsString({ message: 'name format should be string' })
  name: string;

  @IsNotEmpty({ message: 'address cannot be empty' })
  @IsString({ message: 'address format should be string' })
  address: string;

  @IsNotEmpty({ message: 'city cannot be empty' })
  @IsString({ message: 'city format should be string' })
  city: string;

  @IsNotEmpty({ message: 'postcode cannot be empty' })
  @IsString({ message: 'postcode format should be string' })
  postcode: string;

  @IsNotEmpty({ message: 'state cannot be empty' })
  @IsString({ message: 'state format should be string' })
  state: string;

  @IsNotEmpty({ message: 'country cannot be empty' })
  @IsString({ message: 'country format should be string' })
  country: string;
}
