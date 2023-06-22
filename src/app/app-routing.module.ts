import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
	{ path: 'presentation',
		loadChildren: () => import('./features/presentation-definition/presentation-definition.module').
			then(m => m.PresentationDefinitionModule )}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
