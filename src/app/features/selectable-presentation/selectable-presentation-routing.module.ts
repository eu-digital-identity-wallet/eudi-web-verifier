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
        loadChildren: () => import('@features/invoke-wallet/invoke-wallet.module').then(m => m.InvokeWalletModule)
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
        loadChildren: () => import('@features/invoke-wallet/invoke-wallet.module').then(m => m.InvokeWalletModule)
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SiopCustomRoutingModule { }
