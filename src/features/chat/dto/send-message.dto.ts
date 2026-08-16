import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class SendMessageDto {
  @IsInt()
  @Min(1)
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
