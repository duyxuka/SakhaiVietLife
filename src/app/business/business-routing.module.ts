import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductComponent } from "./sanphamlist/sanpham/product.component";
import { permissionGuard } from "@abp/ng.core";
import { NhomSanPhamComponent } from "./sanphamlist/nhomsanpham/nhomsanpham.component";
import { DonViTinhComponent } from "./sanphamlist/donvitinh/donvitinh.component";

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule { }