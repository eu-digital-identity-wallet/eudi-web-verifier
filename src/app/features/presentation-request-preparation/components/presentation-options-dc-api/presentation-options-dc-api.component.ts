import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatCardHeader,
  MatCardSubtitle,
  MatCard,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';

import {
  DCApiPresentationOptions,
  DefaultDCApiPresentationOptions,
  Profile,
} from '@app/core/models/TransactionInitializationRequest';
import { DefaultProfile } from '@app/core/constants/general';
import { isDCApiSupported } from '@shared/utils/dc-api-utils';

@Component({
  selector: 'vc-presentation-options-dc-api',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardHeader,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
  ],
  templateUrl: './presentation-options-dc-api.component.html',
  styleUrl: './presentation-options-dc-api.component.scss',
})
export class PresentationOptionsDcApiComponent {
  readonly dcApiSupported = isDCApiSupported();

  @Output() optionsChanged = new EventEmitter<DcApiPresentationOptionsChangedEvent>();
  
    originControl = new FormControl<string>(DefaultDCApiPresentationOptions.origin || '', {
      nonNullable: true,
    });
  expectedOrigin?: string = DefaultDCApiPresentationOptions.origin
  defaultOrigin: string = DefaultDCApiPresentationOptions.origin!
  options: DCApiPresentationOptions = DefaultDCApiPresentationOptions

  handleExpectedOriginChange(event: string) {
    this.options.origin = event;
    console.log(event)
    this.optionsChanged.emit({type: "dc-api", options: this.options});
  }

}

export type DcApiPresentationOptionsChangedEvent = {
  type: "dc-api"
  options: DCApiPresentationOptions;
}