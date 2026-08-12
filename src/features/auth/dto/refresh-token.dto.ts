import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'seu-refresh-token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
