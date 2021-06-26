import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "",
            ignoreExpiration: true,
        });
    }

    async validate(payload): Promise<User> {
        const { _id } = payload
        const user = await this.userModel.findById(_id)

        if (!user) {
            throw new UnauthorizedException()
        }
        return user;
    }
}
