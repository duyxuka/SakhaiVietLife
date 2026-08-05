import { permissionGuard } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaivietComponent } from './baiviet/baiviet.component';
import { DanhmucComponent } from './danhmuc/danhmuc.component';
import { NhomComponent } from './nhom/nhom.component';
import { SanphaminsurerComponent } from './sanphaminsurer/sanphaminsurer.component';
import { DangkytuvanComponent } from './dangkytuvan/dangkytuvan.component';
import { SeoconfigComponent } from './seos/seoconfig.component';

const routes: Routes = [
  {
    path: 'seos',
    component: SeoconfigComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminInsurer.SeoConfig.View',
    },
  },
  {
    path: 'baiviet',
    component: BaivietComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminInsurer.BaiViet.View',
    },
  },
  {
    path: 'danhmuc',
    component: DanhmucComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminInsurer.DanhMuc.View',
    },
  },
  {
    path: 'nhom',
    component: NhomComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminInsurer.Nhom.View',
    },
  },
  {
    path: 'sanphaminsurer',
    component: SanphaminsurerComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminInsurer.SanPhamInsurer.View',
    },
  },
  {
    path: 'dangkytuvan',
    component: DangkytuvanComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminInsurer.DangKyTuVan.View',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsurerRoutingModule { }
