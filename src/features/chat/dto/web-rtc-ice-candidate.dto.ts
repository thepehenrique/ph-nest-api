import { IsInt, IsNotEmpty, IsObject } from 'class-validator';

export class WebRTCIceCandidateDto {
  @IsInt()
  @IsNotEmpty()
  receiverId: number;

  @IsObject()
  @IsNotEmpty()
  candidate: {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
    usernameFragment?: string | null;
  };
}
