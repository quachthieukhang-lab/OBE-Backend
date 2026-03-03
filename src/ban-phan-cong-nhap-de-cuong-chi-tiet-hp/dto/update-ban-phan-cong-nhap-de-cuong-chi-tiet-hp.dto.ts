import { PartialType } from '@nestjs/swagger';
import { CreateBanPhanCongNhapDeCuongChiTietHpDto } from './create-ban-phan-cong-nhap-de-cuong-chi-tiet-hp.dto';

export class UpdateBanPhanCongNhapDeCuongChiTietHpDto extends PartialType(CreateBanPhanCongNhapDeCuongChiTietHpDto) {}
