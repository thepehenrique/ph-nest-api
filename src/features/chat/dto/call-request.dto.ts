import { IsInt, IsNotEmpty } from 'class-validator';

export class CallRequestDto {
  @IsInt()
  @IsNotEmpty()
  receiverId: number;
}
