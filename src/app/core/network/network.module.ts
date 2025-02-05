import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@NgModule({ declarations: [], imports: [CommonModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class NetworkModule { }
