import { permissionGuard } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TinTucComponent } from './tintuc/tintuc.component';
import { LienHeComponent } from './lienhe/lienhe.component';

const routes: Routes = [
  {
    path: 'tintuc',
    component: TinTucComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminTuongTac.TinTuc.View',
    },
  },
  {
    path: 'lienhe',
    component: LienHeComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietLifeAdminTuongTac.LienHe.View',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TuongTacRoutingModule { }
