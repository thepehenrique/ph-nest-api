import { IsInt, IsNotEmpty, IsObject } from 'class-validator';

export class WebRTCAnswerDto {
  @IsInt()
  @IsNotEmpty()
  receiverId: number;

  @IsObject()
  @IsNotEmpty()
  answer: {
    type: 'answer';
    sdp: string;
  };
}
