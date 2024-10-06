import {Component, inject} from '@angular/core';
import {NavigateService} from '@app/core/services/navigate.service';
import {HOME_ACTIONS} from '@core/constants/pages-actions';
import {ActionCode} from '@app/shared/elements/body-actions/models/ActionCode';
import {BodyAction} from '@app/shared/elements/body-actions/models/BodyAction';
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {RadioGroupComponent} from "@shared/elements/radio-group/radio-group.component";
import {SharedModule} from "@shared/shared.module";
import {InputSchemeComponent} from "@features/home/components/input-scheme/input-scheme.component";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {OpenLogsComponent} from "@shared/elements/open-logs/open-logs.component";
import {MatDialogModule} from "@angular/material/dialog";
import {RouterOutlet} from "@angular/router";
import {
  ScenarioComponent
} from "@features/presentation-request-preparation/components/scenario/scenario.component";
import {MatStepperModule} from "@angular/material/stepper";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ScenarioSelection} from "@features/presentation-request-preparation/models/ScenarioSelection";
import {
  AttributeSelectionComponent
} from "@features/presentation-request-preparation/components/attribute-selection/attribute-selection.component";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    RadioGroupComponent,
    SharedModule,
    InputSchemeComponent,
    WalletLayoutComponent,
    OpenLogsComponent,
    MatDialogModule,
    RouterOutlet,
    ScenarioComponent,
    MatStepperModule,
    ReactiveFormsModule,
    MatButtonModule,
    AttributeSelectionComponent
  ],
	selector: 'vc-presentation-preparation-home',
	templateUrl: './home.component.html'
})
export class HomeComponent {
	constructor (
    private readonly navigateService: NavigateService,
	) {}

	actions: BodyAction[] = HOME_ACTIONS;

  private _formBuilder = inject(FormBuilder);
  formGroup = this._formBuilder.group({
    selectAttestationCtrl: ['', Validators.required]
  });

  scenarioSelection: ScenarioSelection | null = null;

  submit () {

  }

  handleSelectionChangedEvent($event: ScenarioSelection) {
    this.scenarioSelection = $event;
    console.log(this.scenarioSelection);
  }

	runActions (data: BodyAction) {
		if (data.code === ActionCode.BACK) {
			this.navigateService.goBack();
		}
	}
}
