import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "@features/presentation-request-preparation/home/home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@features/presentation-request-preparation/components/scenario/scenario.component')
          .then(c => c.ScenarioComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentationRequestPreparationRoutingModule {}
