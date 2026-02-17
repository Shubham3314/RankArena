import { IsArray, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SaveAnswerDto {
  @IsInt()
  @Type(() => Number)
  questionId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  optionIds: number[] = [];
}
