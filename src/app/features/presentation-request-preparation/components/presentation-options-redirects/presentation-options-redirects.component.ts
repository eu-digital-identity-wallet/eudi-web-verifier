import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardHeader, MatCardSubtitle, MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { Profile, profileOptions, RedirectsPresentationOptions, RequestUriMethod } from '@app/core/models/TransactionInitializationRequest';
import { DefaultProfile, DefaultRequestUriMethod } from '@app/core/constants/general';

@Component({
  selector: 'vc-presentation-options-redirects',
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
  templateUrl: './presentation-options-redirects.component.html',
  styleUrl: './presentation-options-redirects.component.scss',
})
export class PresentationOptionsRedirectsComponent {
  
  @Output() optionsChanged = new EventEmitter<RedirectsPresentationOptionsChangedEvent>();

  requestUriMethodControl = new FormControl<RequestUriMethod>(DefaultRequestUriMethod, {
    nonNullable: true,
  });
  authorizationSchemeControl = new FormControl<string>(
    profileOptions[DefaultProfile].endpoint,
    {nonNullable: true}
  );
  presentationProfileControl = new FormControl<Profile>(DefaultProfile, {
    nonNullable: true,
  });
  options: RedirectsPresentationOptions = {
    profile: DefaultProfile,
    requestUriMethod: DefaultRequestUriMethod,
    authorizationRequestUri: profileOptions[DefaultProfile].endpoint,
  }
  
  handlePresentationProfileChange(event: string) {
    if(!event) return;
    
    const selectedProfile = event as Profile;
    this.authorizationSchemeControl.setValue(profileOptions[selectedProfile].endpoint);
    this.options.authorizationRequestUri = profileOptions[selectedProfile].endpoint;
    this.options.profile = selectedProfile;
    this.optionsChanged.emit({
      type: "redirects",
      options: this.options
    });
  }

  handleRequestUriMethodChange(event: string) {
    const selectedRequestUriMethod = event as RequestUriMethod;
    this.options.requestUriMethod = selectedRequestUriMethod;
    this.optionsChanged.emit({
      type: "redirects",
      options: this.options
    });
  }

  handleAuthorizationSchemeChange(event: string) {
    this.options.authorizationRequestUri = event;
    this.optionsChanged.emit({
      type: "redirects",
      options: this.options
    });
  }
}

export type RedirectsPresentationOptionsChangedEvent = {
  type: "redirects";
  options: RedirectsPresentationOptions;
}