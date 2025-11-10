import { permissionGuard } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttributeComponent } from './attribute/attribute.component';
import { ProductComponent } from './product/product.component';
import { PhongBanComponent } from './phongban/phongban.component';
import { ChucVuComponent } from './chucvu/chucvu.component';
import { ChamCongComponent } from './chamcong/chamcong.component';
import { ChiNhanhComponent } from './chinhanh/chinhanh.component';
import { LichLamViecComponent } from './lichlamviec/lichlamviec.component';
import { LoaiCheDoComponent } from './loaichedo/loaichedo.component';
import { CheDoNhanVienComponent } from './chedonhanvien/chedonhanvien.component';
import { PhuCapNhanVienComponent } from './phucapnhanvien/phucapnhanvien.component';
import { KpiNhanVienComponent } from './kpis/kpinhanvien/kpinhanvien.component';
import { KeHoachCongViecComponent } from './kpis/kehoachcongviec/kehoachcongviec.component';
import { MucTieuKpiComponent } from './kpis/muctieukpi/muctieukpi.component';
import { TienDoLamViecComponent } from './kpis/tiendolamviec/tiendolamviec.component';
import { DanhGiaKpiComponent } from './kpis/danhgiakpi/danhgiakpi.component';
import { LuongNhanvienComponent } from './luongnhanvien/luongnhanvien.component';

const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.Product',
    },
  },
  {
    path: 'attribute',
    component: AttributeComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.Attribute',
    },
  },
  {
    path: 'phongban',
    component: PhongBanComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.PhongBan.View',
    },
  },
  {
    path: 'chucvu',
    component: ChucVuComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.ChucVu.View',
    },
  },
  {
    path: 'chamcong',
    component: ChamCongComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.ChamCong.View',
    },
  },
  {
    path: 'chinhanh',
    component: ChiNhanhComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.ChiNhanh.View',
    },
  },
  {
    path: 'lichlamviec',
    component: LichLamViecComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.LichLamViec.View',
    },
  },
  {
    path: 'loaichedo',
    component: LoaiCheDoComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.LoaiCheDo.View',
    },
  },
  {
    path: 'chedonhanvien',
    component: CheDoNhanVienComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.CheDoNhanVien.View',
    },
  },
  {
    path: 'phucapnhanvien',
    component: PhuCapNhanVienComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.PhuCapNhanVien.View',
    },
  },
  {
    path: 'kpis',
    canActivate: [permissionGuard],
    data: { requiredPolicy: 'VietLifeAdminCatalog.KpiNhanVien.View' },
    children: [
      {
        path: 'kpinhanvien',
        component: KpiNhanVienComponent,
        canActivate: [permissionGuard],
        data: { requiredPolicy: 'VietLifeAdminCatalog.KpiNhanVien.View' },
      },
      {
        path: 'kehoachcongviec',
        component: KeHoachCongViecComponent,
        canActivate: [permissionGuard],
        data: { requiredPolicy: 'VietLifeAdminCatalog.KpiNhanVien.KeHoachCongViec.View' },
      },
      {
        path: 'muctieukpi',
        component: MucTieuKpiComponent,
        canActivate: [permissionGuard],
        data: { requiredPolicy: 'VietLifeAdminCatalog.KpiNhanVien.MucTieuKpi.View' },
      },
      {
        path: 'tiendolamviec',
        component: TienDoLamViecComponent,
        canActivate: [permissionGuard],
        data: { requiredPolicy: 'VietLifeAdminCatalog.KpiNhanVien.TienDoLamViec.View' },
      },
      {
        path: 'danhgiakpi',
        component: DanhGiaKpiComponent,
        canActivate: [permissionGuard],
        data: { requiredPolicy: 'VietLifeAdminCatalog.KpiNhanVien.DanhGiaKpi.View' },
      },
    ],
  },

  {
    path: 'luongnhanvien',
    component: LuongNhanvienComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminCatalog.LuongNhanVien.View',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule { }
