import { PartialType } from '@nestjs/swagger';
import { CreateCauHinhObeDto } from './create-cau-hinh-obe.dto';

export class UpdateCauHinhObeDto extends PartialType(CreateCauHinhObeDto) {}
