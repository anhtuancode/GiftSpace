import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, {message: "Email không đúng định dạng"})
    @IsNotEmpty({message: "Email không được để trống"})
    @IsString({message: "Email phải là chuỗi"})
    email: string;

    @IsString({message: "Password phải là chuỗi"})
    @MinLength(8, {message: "Password tối thiểu 8 ký tự"})
    @IsNotEmpty({message: "Password không được để trống"})
    password: string;
}