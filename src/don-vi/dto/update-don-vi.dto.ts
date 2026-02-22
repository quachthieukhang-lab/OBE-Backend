import { PartialType } from '@nestjs/swagger';
import { CreateDonViDto } from './create-don-vi.dto';

export class UpdateDonViDto extends PartialType(CreateDonViDto) {}
