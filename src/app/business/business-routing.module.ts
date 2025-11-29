import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductComponent } from "./sanphamlist/sanpham/product.component";
import { permissionGuard } from "@abp/ng.core";
import { NhomSanPhamComponent } from "./sanphamlist/nhomsanpham/nhomsanpham.component";
import { DonViTinhComponent } from "./sanphamlist/donvitinh/donvitinh.component";
import { KhoHangComponent } from "./khohang/khohang.component";
import { ThanhPhoComponent } from "./thanhpho/thanhpho.component";
import { TienTeComponent } from "./tiente/tiente.component";
import { LoaiKhachHangComponent } from "./khachhanglist/loaikhachhang/loaikhachhang.component";
import { KhachHangComponent } from "./khachhanglist/khachhang/khachhang.component";
import { LoaiThuChiComponent } from "./thuchilist/loaithuchi/loaithuchi.component";
import { TaiKhoanKeToanComponent } from "./thuchilist/taikhoanketoan/taikhoanketoan.component";
import { ThuChiComponent } from "./thuchilist/thuchi/thuchi.component";
import { LoaiNhapXuatComponent } from "./phieunhapxuat/loainhapxuat/loainhapxuat.component";
import { PhieuNhapXuatComponent } from "./phieunhapxuat/phieunhapxuat/phieunhapxuat.component";
import { LoaiDonHangComponent } from "./donhang/loaidonhang/loaidonhang.component";
import { DonHangComponent } from "./donhang/donhang/donhang.component";
import { BaoGiaComponent } from "./baogia/baogia.component";

const routes: Routes = [
  {
    path: 'sanpham',
    component: ProductComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.SanPham.View',
    },
  },
  {
    path: 'nhomsanpham',
    component: NhomSanPhamComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.NhomSanPham.View',
    },
  },
  {
    path: 'donvitinh',
    component: DonViTinhComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.DonViTinh.View',
    },
  },
  {
    path: 'khohang',
    component: KhoHangComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.KhoHang.View',
    },
  },
  {
    path: 'thanhpho',
    component: ThanhPhoComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.ThanhPho.View',
    },
  },
  {
    path: 'tiente',
    component: TienTeComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.TienTe.View',
    },
  },
  {
    path: 'loaikhachhang',
    component: LoaiKhachHangComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.LoaiKhachHang.View',
    },
  },
  {
    path: 'khachhang',
    component: KhachHangComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.KhachHang.View',
    },
  },
  {
    path: 'loaithuchi',
    component: LoaiThuChiComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.LoaiThuChi.View',
    },
  },
  {
    path: 'taikhoanketoan',
    component: TaiKhoanKeToanComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.TaiKhoanKeToan.View',
    },
  },
  {
    path: 'thuchi',
    component: ThuChiComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.ThuChi.View',
    },
  },
  {
    path: 'loainhapxuat',
    component: LoaiNhapXuatComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.LoaiNhapXuat.View',
    },
  },
  {
    path: 'phieunhapxuat',
    component: PhieuNhapXuatComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.PhieuNhapXuat.View',
    },
  },
  {
    path: 'loaidonhang',
    component: LoaiDonHangComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.LoaiDonHang.View',
    },
  },
  {
    path: 'donhang',
    component: DonHangComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.DonHang.View',
    },
  },
  {
    path: 'baogia',
    component: BaoGiaComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.BaoGia.View',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule { }