import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'title cannot be blank!' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'description cannot be blank!' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'price  cannot be empty!' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price should be number & max decimal precision 2' },
  )
  @IsPositive({ message: 'price should be positive integer!' })
  price: number;

  @IsNotEmpty({ message: ' stock should not be empty!' })
  @IsNumber({}, { message: 'stock  should be number ' })
  @Min(0, { message: 'stock  cannot be a negative integer!' })
  stock: number;

  @IsNotEmpty({ message: ' image  should not be empty!' })
  @IsArray({ message: ' image  should be in  array! format' })
  image: string[];

  @IsNotEmpty({ message: ' category  should not be empty!' })
  @IsNumber({}, { message: 'category  should be number ' })
  categoriesId: number;
}
