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
  DCApiRequestType,
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

  options: DCApiPresentationOptions = {
    profile: DefaultProfile,
    requestType: 'signed',
  }

  presentationProfileControl = new FormControl<Profile>(this.options.profile, {
    nonNullable: true,
  });
  requestTypeControl = new FormControl<DCApiRequestType>(this.options.requestType, {
    nonNullable: true,
  });

  handlePresentationProfileChange(event: string) {
    const selectedProfile = event as Profile;
    this.options.profile = selectedProfile;
    this.optionsChanged.emit({
      type: "dc-api",
      options: this.options
    });
  }

  handleRequestTypeChange(event: string) {
    const selectedRequestType = event as DCApiRequestType;
    this.options.requestType = selectedRequestType;
    this.optionsChanged.emit({
      type: "dc-api",
      options: this.options
    });
  }
}

export type DcApiPresentationOptionsChangedEvent = {
  type: "dc-api"
  options: DCApiPresentationOptions;
}