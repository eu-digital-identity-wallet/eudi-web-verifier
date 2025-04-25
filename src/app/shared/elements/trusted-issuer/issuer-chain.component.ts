import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { SessionStorageService } from '@app/core/services/session-storage.service';
import { ISSUER_CHAIN } from '@core/constants/general';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

function certificateValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value.trim();

  if (!value) {
    return null;
  }

  if (
    !value.startsWith('-----BEGIN CERTIFICATE-----') ||
    !value.endsWith('-----END CERTIFICATE-----')
  ) {
    return { invalidCertificate: true };
  } else {
    return null;
  }
}

@Component({
  selector: 'vc-trusted-issuer',
  imports: [
    CommonModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    SharedModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './issuer-chain.component.html',
  styleUrl: './issuer-chain.component.scss',
})
export class IssuerChainComponent implements OnInit {
  readonly sessionStorageService: SessionStorageService = inject(
    SessionStorageService
  );

  issuerChainControl = new FormControl('', [certificateValidator]);

  ngOnInit(): void {
    const certs = this.sessionStorageService.get(ISSUER_CHAIN) ?? '';

    if (certs && certs !== '') {
      this.issuerChainControl.setValue(certs);
    }
  }

  clear() {
    this.sessionStorageService.remove(ISSUER_CHAIN);
  }

  save() {
    const { value } = this.issuerChainControl;
    if (value) {
      this.sessionStorageService.set(ISSUER_CHAIN, value.trim());
    } else {
      this.sessionStorageService.remove(ISSUER_CHAIN);
    }
  }
}
