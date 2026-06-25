import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '@app/core/services/data-service';
import { SharedModule } from '@app/shared/shared.module';

@Component({
  selector: 'vc-presentation-request-editor',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    SharedModule,
    MatButtonToggleModule,
  ],
  templateUrl: './custom-request-editor.component.html',
  styleUrls: ['./custom-request-editor.component.scss'],
})
export class CustomRequestEditorComponent {
  invalidJSON = true;
  constructor(private readonly dataService: DataService) {}

  requestObjectJson: string = '';
  channel: 'redirects' | 'dc-api' = 'redirects';

  onRequestChanged(requestObjectJson: string) {
    this.requestObjectJson = requestObjectJson;
    this.invalidJSON =
      requestObjectJson.length === 0 || this.isJSON(requestObjectJson);
    this.dataService.customRequest$.next({
      requestObjectJson: requestObjectJson,
      channel: this.channel,
    });
  }

  onChannelChanged(channel: 'dc-api' | 'redirects') {
    this.channel = channel;
    this.dataService.customRequest$.next({
      requestObjectJson: this.requestObjectJson,
      channel: channel,
    });
  }

  isJSON(requestCode: string) {
    try {
      return JSON.parse(requestCode) && !!requestCode;
    } catch (e) {
      return false;
    }
  }
}
