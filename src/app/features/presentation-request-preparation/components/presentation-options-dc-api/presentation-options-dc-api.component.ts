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
} from '@app/core/models/TransactionInitializationRequest';
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

  expectedOriginsControl = new FormControl<string>(
    (DefaultDCApiPresentationOptions.expected_origins || []).join(', '),
    {
      nonNullable: true,
    }
  );
  defaultOrigins: string = (DefaultDCApiPresentationOptions.expected_origins || []).join(', ');
  options: DCApiPresentationOptions = DefaultDCApiPresentationOptions;

  handleExpectedOriginsChange(event: string) {
    this.options.expected_origins = event
      .split(',')
      .map((o) => o.trim())
      .filter((o) => o.length > 0);
    this.optionsChanged.emit({ type: 'dc-api', options: this.options });
  }

}

export type DcApiPresentationOptionsChangedEvent = {
  type: "dc-api"
  options: DCApiPresentationOptions;
}