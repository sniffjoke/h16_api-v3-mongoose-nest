import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import {UsersService} from "../application/users.service";
import {UsersQueryRepository} from "../infrastructure/users.query-repository";
import {UserCreateModel} from "./models/input/create-user.input.model";
import {UserViewModel} from "./models/output/user.view.model";
import {PaginationBaseModel} from "../../../core/base/pagination.base.model";
import { BasicAuthGuard } from "../../../core/guards/basic-auth.guard";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersQueryRepository: UsersQueryRepository,
    ) {}

    @Get()
    async getAllUsers(@Query() query: any): Promise<PaginationBaseModel<UserViewModel>> {
        const users = await this.usersQueryRepository.getAllUsersWithQuery(query)
        return users
    }

    // @UsePipes(ValidationPipe)
    @Post()
    @UseGuards(BasicAuthGuard)
    async createUser(@Body() dto: UserCreateModel): Promise<UserViewModel> {
        const userId = await this.usersService.createUser(dto, true)
        const newUser = await this.usersQueryRepository.userOutput(userId)
        return newUser
    }

    @Get(':id')
    @UseGuards(BasicAuthGuard)
    async getUserById(@Param('id') id: string): Promise<UserViewModel> {
        const user = await this.usersQueryRepository.userOutput(id)
        return user
    }

    @Delete(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(204)
    async deleteUser(@Param('id') id: string) {
        const user = await this.usersService.deleteUser(id)
        return user
    }

}
