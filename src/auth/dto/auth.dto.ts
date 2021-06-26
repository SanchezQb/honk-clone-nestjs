import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";


const passwordValidator = new RegExp(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)


export class CreateUserDto {

    @MaxLength(20)
    name: string;

    @IsNotEmpty()
    username: string;

    @MinLength(6)
    @Matches(passwordValidator, {
        message: "Password must have an uppercase letter, a lowercase letter and a number or symbol"
    })
    password: string;
}


export class LoginDto {
    @IsNotEmpty()
    username: string;

    @MinLength(6)
    password: string;
}