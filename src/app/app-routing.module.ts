import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', loadComponent: () => import('./features/home/components/home/home.component').then(c => c.HomeComponent) },
	{ path: 'presentation',
		loadChildren: () => import('./features/presentation-definition/presentation-definition.module').
			then(m => m.PresentationDefinitionModule )},
	{ path: 'siop',
		loadChildren: () => import('./features/siop/siop.module').
			then(m => m.SIOPModule )},
	{ path: 'cbor',
		loadChildren: () => import('./features/cbor/cbor.module').
			then(m => m.CborModule )},
	{ path: 'cbor-selectable',
		loadChildren: () => import('./features/siop-custom/cbor-selectable.module').
			then(m => m.SiopCustomModule )},
	{
		path: 'test-qr',
		loadComponent: () => import('./features/test-qr/test-qr.component').then(m => m.TestQrComponent )
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
