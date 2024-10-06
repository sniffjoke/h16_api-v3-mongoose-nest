import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User} from "../domain/users.entity";
import {HydratedDocument, Model} from "mongoose";
import {UserViewModel} from "../api/models/output/user.view.model";
import {PaginationBaseModel} from "../../../core/base/pagination.base.model";


@Injectable()
export class UsersQueryRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {
    }

    // async getAllUsers(): Promise<UserViewModel[]> {
    //     const users = await this.userModel.find()
    //     return users.map(user => this.userOutputMap(user as unknown as HydratedDocument<UserViewModel>))
    // }

    async getAllUsersWithQuery(query: any): Promise<PaginationBaseModel<UserViewModel>> {
        const generateQuery = await this.generateQuery(query)
        const items = await this.userModel
            .find(generateQuery.userParamsFilter)
            // .find({$or: [{email: generateQuery.filterEmail}, {login: generateQuery.filterLogin}]})
            .sort({[generateQuery.sortBy]: generateQuery.sortDirection})
            .limit(generateQuery.pageSize)
            .skip((generateQuery.page - 1) * generateQuery.pageSize)
        const itemsOutput = items.map(item => this.userOutputMap(item as unknown as HydratedDocument<UserViewModel>))
        const resultPosts = new PaginationBaseModel<UserViewModel>(generateQuery, itemsOutput)
        return resultPosts
    }

    private async generateQuery(query: any) {
        const searchLoginTerm = query.searchLoginTerm ? query.searchLoginTerm : ''
        const searchEmailTerm = query.searchEmailTerm ? query.searchEmailTerm : ''
        const filterLogin = {$regex: searchLoginTerm, $options: "i"}
        const filterEmail = {$regex: searchEmailTerm, $options: "i"}
        const userParamsFilter = {$or: [{login: filterLogin}, {email: filterEmail}]}
        const totalCount = await this.userModel.countDocuments(userParamsFilter)
        const pageSize = query.pageSize ? +query.pageSize : 10
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            totalCount,
            pageSize,
            pagesCount,
            page: query.pageNumber ? Number(query.pageNumber) : 1,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection : 'desc',
            userParamsFilter,
            filterLogin,
            filterEmail
        }
    }


    async userOutput(id: string): Promise<UserViewModel> {
        const user = await this.userModel.findById(id)
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return this.userOutputMap(user as unknown as HydratedDocument<UserViewModel>)
    }

    userOutputMap(user: HydratedDocument<UserViewModel>): UserViewModel {
        const {_id, login, email, createdAt} = user
        return {
            id: _id.toString(),
            login,
            email,
            createdAt
        }
    }

}
