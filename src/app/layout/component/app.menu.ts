import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul>
  `,
})
export class AppMenu implements OnInit {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Trang chủ',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
        ],
      },
      {
        label: 'Nhân sự',
        items: [
          {
            label: 'Chi nhánh',
            icon: 'pi pi-fw pi-building',
            routerLink: ['/catalog/chinhanh'],
            permission: 'VietLifeAdminCatalog.ChiNhanh.View',
          },
          {
            label: 'Phòng ban',
            icon: 'pi pi-fw pi-sitemap',
            routerLink: ['/catalog/phongban'],
            permission: 'VietLifeAdminCatalog.PhongBan.View',
          },
          {
            label: 'Chức vụ',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/catalog/chucvu'],
            permission: 'VietLifeAdminCatalog.ChucVu.View',
          },
          {
            label: 'Bảng chấm công',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['/catalog/chamcong'],
            permission: 'VietLifeAdminCatalog.ChamCong.View',
          },
          {
            label: 'Lịch làm việc',
            icon: 'pi pi-fw pi-clock',
            routerLink: ['/catalog/lichlamviec'],
            permission: 'VietLifeAdminCatalog.LichLamViec.View',
          },
          {
            label: 'Chế độ nhân viên',
            icon: 'pi pi-fw pi-users',
            items: [
              {
                label: 'Loại chế độ',
                icon: 'pi pi-fw pi-cog',
                routerLink: ['/catalog/loaichedo'],
                permission: 'VietLifeAdminCatalog.LoaiCheDo.View',
              },
              {
                label: 'Chế độ NV',
                icon: 'pi pi-fw pi-user-edit',
                routerLink: ['/catalog/chedonhanvien'],
                permission: 'VietLifeAdminCatalog.CheDoNhanVien.View',
              },
            ],
          },
          {
            label: 'Phụ cấp nhân viên',
            icon: 'pi pi-fw pi-wallet',
            routerLink: ['/catalog/phucapnhanvien'],
            permission: 'VietLifeAdminCatalog.PhuCapNhanVien.View',
          },
          {
            label: 'KPI nhân viên',
            icon: 'pi pi-fw pi-chart-line',
            items: [
              {
                label: 'KPI',
                routerLink: ['/catalog/kpis/kpinhanvien'],
                permission: 'VietLifeAdminCatalog.KpiNhanVien.View',
              },
              {
                label: 'Kế hoạch công việc',
                routerLink: ['/catalog/kpis/kehoachcongviec'],
                permission: 'VietLifeAdminCatalog.KpiNhanVien.KeHoachCongViec.View',
              },
              {
                label: 'Mục tiêu KPI',
                routerLink: ['/catalog/kpis/muctieukpi'],
                permission: 'VietLifeAdminCatalog.KpiNhanVien.MucTieuKpi.View',
              },
              {
                label: 'Tiến độ làm việc',
                routerLink: ['/catalog/kpis/tiendolamviec'],
                permission: 'VietLifeAdminCatalog.KpiNhanVien.TienDoLamViec.View',
              },
              {
                label: 'Đánh giá KPI',
                routerLink: ['/catalog/kpis/danhgiakpi'],
                permission: 'VietLifeAdminCatalog.KpiNhanVien.DanhGiaKpi.View',
              },
            ],
          },
          {
            label: 'Lương nhân viên',
            icon: 'pi pi-fw pi-money-bill',
            routerLink: ['/catalog/luongnhanvien'],
            permission: 'VietLifeAdminCatalog.LuongNhanVien.View',
          },
        ],
      },
      {
        label: 'Hệ thống',
        items: [
          {
            label: 'Quyền',
            icon: 'pi pi-fw pi-lock',
            routerLink: ['/system/role'],
            permission: 'AbpIdentity.Roles.View',
          },
          {
            label: 'Người dùng',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/system/user'],
            permission: 'AbpIdentity.Users.View',
          },
        ],
      },
    ];
  }
}
