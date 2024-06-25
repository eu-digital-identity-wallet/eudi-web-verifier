import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SelectablePresentationFormComponent } from '@features/selectable-presentation/components/selectable-presentation-form/selectable-presentation-form.component';
const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
			{
				path: 'view',
				loadComponent: () => import('../verifiable-credential/components/qr-code/qr-code.component').then(c => c.QrCodeComponent)
			},
			{
				path: 'create',
				component: SelectablePresentationFormComponent
			},
			{
				path: 'pid-create',
				component: SelectablePresentationFormComponent
			},
			{
				path: 'verifiable',
				loadComponent:
        () => import('../verifiable-credential/components/qr-code/qr-code.component').then(c => c.QrCodeComponent)
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SiopCustomRoutingModule { }
