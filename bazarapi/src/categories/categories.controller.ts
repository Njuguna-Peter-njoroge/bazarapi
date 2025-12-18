import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationGuard } from '../Utility/Guards/auth-guard';
import { AuthorizeGuard } from '../Utility/Guards/authorization.guard';
import { Roles } from '../Utility/common/user-roles.enum';
import { CategoryEntity } from './entities/category.entity';
import { CurrentUser } from '../Utility/Decorators/current-user.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('all')
  findAll(): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryEntity> {
    return this.categoriesService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // remember to fix addedby in update
  // use selsect ,,id truie, email:true;,name:true


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
