
export interface ChiTietDonHangDto {
  id?: string;
  donHangId?: string;
  sanPhamId?: string;
  soLuong: number;
  donGia: number;
  chietKhau: number;
  vat: number;
  thanhTien: number;
}

export interface CreateUpdateChiTietDonHangDto {
  id?: string;
  donHangId?: string;
  sanPhamId?: string;
  soLuong: number;
  donGia: number;
  chietKhau: number;
  vat: number;
}
