import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateAScenarioComponent } from './components/create-a-scenario/create-a-scenario.component';
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
				component: CreateAScenarioComponent
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
