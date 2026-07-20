import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { VerifierEndpointService } from '@app/core/services/verifier-endpoint.service';
import { IntendedUse } from '@app/core/models/IntendedUse';

@Component({
  selector: 'vc-presentation-options-registration-certificate',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ClipboardModule,
  ],
  templateUrl: './presentation-options-registration-certificate.component.html',
  styleUrl: './presentation-options-registration-certificate.component.scss',
})
export class PresentationOptionsRegistrationCertificateComponent implements OnInit {
  @Output() registrationCertificateOptionsChanged = new EventEmitter<RegistrationCertificatePresentationOptionsChangedEvent>();

  registrationCertificateControl = new FormControl<string>('', { nonNullable: true });
  intendedUseControl = new FormControl<string | null>(null);
  intendedUses: IntendedUse[] = [];

  get selectedIntendedUse(): IntendedUse | null {
    const id = this.intendedUseControl.value;
    return id ? (this.intendedUses.find((u) => u.intended_use_id === id) ?? null) : null;
  }

  get truncatedRegistrationCertificate(): string {
    const cert = this.selectedIntendedUse?.registration_certificate;
    if (!cert) return '';
    return cert.length > 40 ? cert.slice(0, 40) + '\u2026' : cert;
  }

  constructor(private readonly verifierEndpointService: VerifierEndpointService) {}

  ngOnInit(): void {
    this.verifierEndpointService.getIntendedUses().subscribe({
      next: (intendedUses) => {
        this.intendedUses = intendedUses;
        this.intendedUseControl.setValue(this.intendedUses[0]?.intended_use_id, { emitEvent: false });
        this.emitChange();
      },
      error: () => (this.intendedUses = []),
    });
  }

  onRegistrationCertificateInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.intendedUseControl.setValue(null, { emitEvent: false });
    }
    this.emitChange();
  }

  onIntendedUseSelectionChange(event: MatSelectChange): void {
    if (event.value) {
      this.registrationCertificateControl.setValue('', { emitEvent: false });
    }
    this.emitChange();
  }

  private emitChange(): void {
    this.registrationCertificateOptionsChanged.emit({
      registrationCertificate: this.registrationCertificateControl.value || undefined,
      intendedUseId: this.intendedUseControl.value || undefined,
    });
  }
}

export type RegistrationCertificatePresentationOptionsChangedEvent = {
  registrationCertificate?: string;
  intendedUseId?: string;
};
