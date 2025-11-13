import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductComponent } from "./sanphamlist/sanpham/product.component";
import { permissionGuard } from "@abp/ng.core";

const routes: Routes = [
  {
    path: 'sanpham',
    component: ProductComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminBusiness.SanPham.View',
    },
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule { }