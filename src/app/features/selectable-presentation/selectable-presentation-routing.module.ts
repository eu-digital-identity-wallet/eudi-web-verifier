import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SelectablePresentationFormComponent } from '@features/selectable-presentation/components/selectable-presentation-form/selectable-presentation-form.component';
const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
      { path: 'create',
				component: SelectablePresentationFormComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SiopCustomRoutingModule { }
