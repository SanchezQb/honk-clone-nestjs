import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {



    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }


    async getUsers(): Promise<User[]> {
        return await this.userModel.find()
    }

    async searchUsers(query: string, user: User): Promise<User[]> {

        console.log("Called")
        const { username } = user
        const regex = new RegExp(query, 'g');
        const users = await this.userModel.find({ username: regex })
        return users.filter(user => user.username != username);
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.userModel.findOne({ username })

        if (!user) {
            throw new UnauthorizedException("Incorrect Username/Password")
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new UnauthorizedException("Incorrect Username / Password")
        }
        const payload = { _id: user._id, name: user.name, username: user.username }
        const accessToken = await this.jwtService.sign(payload)
        return { ...payload, accessToken }
    }

    async signUp(createUserDto: CreateUserDto) {

        const { password } = createUserDto;
        const salt = await bcrypt.genSalt()

        const user = new this.userModel({
            ...createUserDto,
            password: await this.hashPassword(password, salt),
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
        try {
            await user.save()
        }
        catch (e) {
            if (e.code === 11000) {
                let data = e.message.split("$").pop().split("_")[0]

                let field = data.split("index: ")[1]
                throw new ConflictException(`${field} has been taken`)
            }
            else {
                throw new InternalServerErrorException
            }
        }
        const payload = { _id: user._id, name: user.name, username: user.username }
        const accessToken = await this.jwtService.sign(payload)
        return { ...payload, accessToken }
    }

    async getUser(id: string): Promise<User> {
        try {
            const found = await this.userModel.findById(id)
            return found
        }
        catch (e) {
            throw new NotFoundException()
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}
