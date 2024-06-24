import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from "class-validator";

export class CreateOneTimeLinkRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
  })
  @IsString()
  @Length(1)
  value: string;
}
