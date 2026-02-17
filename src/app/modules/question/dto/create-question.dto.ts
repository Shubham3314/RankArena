import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../../../entities/question/question.entity';

export class CreateOptionDto {
  @IsString()
  text: string;

  @IsOptional()
  isCorrect?: boolean;
}

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  text: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  points?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @IsOptional()
  options?: CreateOptionDto[];
}
