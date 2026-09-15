import { IsInt, IsNotEmpty, IsObject } from 'class-validator';

export class WebRTCOfferDto {
  @IsInt()
  @IsNotEmpty()
  receiverId: number;

  @IsObject()
  @IsNotEmpty()
  offer: {
    type: 'offer';
    sdp: string;
  };
}
