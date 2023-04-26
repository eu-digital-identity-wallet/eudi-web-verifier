import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'presentation', pathMatch: 'full' },
	{ path: 'presentation',
		loadChildren: () => import('./features/presentation-definition/presentation-definition.module').
			then(m => m.PresentationDefinitionModule )}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: false})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
