
export interface ChiTietBaoGiaDto {
  id?: string;
  baoGiaId?: string;
  sanPhamId?: string;
  soLuong: number;
  donGia: number;
  chietKhau: number;
  thanhTien: number;
}

export interface CreateUpdateChiTietBaoGiaDto {
  id?: string;
  sanPhamId?: string;
  soLuong: number;
  donGia: number;
  chietKhau: number;
}
