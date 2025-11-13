import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUserDto {
  name?: string;
  surname?: string;
  email?: string;
  userName?: string;
  password?: string;
  phoneNumber?: string;
  maNv?: string;
  hoTen?: string;
  ngaySinh?: string;
  gioiTinh: boolean;
  soCmnd?: string;
  ngayCapCmnd?: string;
  noiCapCmnd?: string;
  diaChi?: string;
  phongBanId?: string;
  chucVuId?: string;
  ngayVaoLam?: string;
  trangThai?: string;
}

export interface SetPasswordDto {
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface UpdateUserDto {
  name?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  maNv?: string;
  hoTen?: string;
  ngaySinh?: string;
  gioiTinh: boolean;
  soCmnd?: string;
  ngayCapCmnd?: string;
  noiCapCmnd?: string;
  diaChi?: string;
  phongBanId?: string;
  chucVuId?: string;
  ngayVaoLam?: string;
  trangThai?: string;
}

export interface UserDto extends AuditedEntityDto<string> {
  name?: string;
  userName?: string;
  email?: string;
  surname?: string;
  phoneNumber?: string;
  roles: string[];
  isActive: boolean;
  maNv?: string;
  hoTen?: string;
  ngaySinh?: string;
  gioiTinh: boolean;
  soCmnd?: string;
  ngayCapCmnd?: string;
  noiCapCmnd?: string;
  diaChi?: string;
  phongBanId?: string;
  chucVuId?: string;
  ngayVaoLam?: string;
  trangThai?: string;
}

export interface UserInListDto extends AuditedEntityDto<string> {
  name?: string;
  surname?: string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  maNv?: string;
  hoTen?: string;
  ngaySinh?: string;
  gioiTinh: boolean;
  soCmnd?: string;
  ngayCapCmnd?: string;
  noiCapCmnd?: string;
  diaChi?: string;
  phongBanId?: string;
  chucVuId?: string;
  ngayVaoLam?: string;
  trangThai?: string;
}
