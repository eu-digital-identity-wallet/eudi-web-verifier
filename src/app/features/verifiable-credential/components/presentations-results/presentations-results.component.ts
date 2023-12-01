import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { TransformedResponse } from '../../models/TransformedResponse';

@Component({
	selector: 'vc-presentations-results',
	standalone: true,
	imports: [CommonModule, MatListModule],
	templateUrl: './presentations-results.component.html',
	styleUrls: ['./presentations-results.component.scss']
})
export class PresentationsResultsComponent {

  @Input() results!: TransformedResponse;
}
