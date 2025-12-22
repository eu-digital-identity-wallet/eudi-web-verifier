import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule, MatCardHeader, MatCardSubtitle, MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';

import {
  Profile,
  RequestUriMethod,
} from '@app/core/models/TransactionInitializationRequest';

@Component({
  selector: 'vc-presentation-options',
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
    MatCardContent
],
  templateUrl: './presentation-options.component.html',
  styleUrl: './presentation-options.component.scss',
})
export class PresentationOptionsComponent {
  @Input() presentationProfileControl!: FormControl<Profile>;
  @Input() requestUriMethodControl!: FormControl<RequestUriMethod>;
  @Input() authorizationSchemeControl!: FormControl<string>;

  @Output() profileChange = new EventEmitter<Profile>();
  @Output() requestUriMethodChange = new EventEmitter<RequestUriMethod>();
  @Output() authorizationSchemeChange = new EventEmitter<string>();
}
