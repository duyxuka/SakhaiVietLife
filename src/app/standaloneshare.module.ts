import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';      
import { InputTextModule } from 'primeng/inputtext';
import { BlockUIModule } from 'primeng/blockui';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';       
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { EditorModule } from 'primeng/editor';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@NgModule({
  exports: [
    CommonModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    SelectModule,     
    InputTextModule,
    BlockUIModule,
    DynamicDialogModule,
    InputNumberModule,
    CheckboxModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    ImageModule,
    PanelModule,
    BadgeModule,
    ToolbarModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    TextareaModule,
    EditorModule,
    ToggleSwitchModule,
  ]
})
export class StandaloneSharedModule {}
