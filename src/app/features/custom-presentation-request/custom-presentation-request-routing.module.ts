import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@features/custom-presentation-request/home/home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
			{ path: '', redirectTo: 'create', pathMatch: 'full' },
			{
				path: 'create',
				loadComponent:
        () => import('@features/custom-presentation-request/components/custom-request-editor/custom-request-editor.component').then(c => c.CustomRequestEditorComponent)
			},
			{
				path: 'verifiable',
				loadComponent:
        () => import('@features/invoke-wallet/components/qr-code/qr-code.component').then(c => c.QrCodeComponent)
			},
		]
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CustomPresentationRequestRoutingModule { }
