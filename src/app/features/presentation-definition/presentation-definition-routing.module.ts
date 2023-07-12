import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
			{ path: '', redirectTo: 'create', pathMatch: 'full' },
			{
				path: 'create',
				loadComponent:
        () => import('./components/presentation-request/presentation-request.component').then(c => c.PresentationRequestComponent)
			},
			{
				path: 'verifiable',
				loadComponent:
        () => import('../../features/verifiable-credential/components/qr-code/qr-code.component').then(c => c.QrCodeComponent)
			},
		]
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PresentationDefinitionRoutingModule { }
