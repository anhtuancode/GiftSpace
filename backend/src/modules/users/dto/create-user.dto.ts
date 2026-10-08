import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsString({ message: 'Họ và tên phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Họ và tên không được để trống' })
    name: string;

    @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @MinLength(8, {message: 'Số điện thoại phải có 10 ký tự'})
    phone: string;

    @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(8, {message: 'Mật khẩu phải có ít nhất 8 ký tự'})
    password: string;

    @IsString({ message: 'Xác nhận mật khẩu phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Xác nhận mật khẩu không được để trống' })
    confirmPassword: string;
}