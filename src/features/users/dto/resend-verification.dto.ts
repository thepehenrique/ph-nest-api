import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerificationDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
