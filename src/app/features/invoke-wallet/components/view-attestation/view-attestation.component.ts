import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {JWTService} from "@core/services/jwt.service";
import {Single} from "@core/models/presentation/PresentedAttestation";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {DialogData} from "@features/invoke-wallet/components/view-attestation/model/DialogData";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";

@Component({
  selector: 'vc-view-attestation',
  standalone: true,
  imports: [CommonModule, SharedModule, MatExpansionModule, MatListModule, MatDialogModule, MatButtonModule, MatTabsModule],
  templateUrl: './view-attestation.component.html',
  providers: [JWTService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAttestationComponent implements OnInit{

  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  attestation!: Single;

  ngOnInit (): void {
    this.attestation = this.data.attestation;
  }
}
