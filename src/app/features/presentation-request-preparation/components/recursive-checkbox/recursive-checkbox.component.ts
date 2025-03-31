import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormSelectableField } from '@app/core/models/FormSelectableField';

@Component({
  selector: 'app-recursive-checkbox',
  templateUrl: './recursive-checkbox.component.html',
  styleUrls: ['./recursive-checkbox.component.scss'],
    imports: [
      CommonModule,
      MatCheckboxModule,
    ]
})
export class RecursiveCheckboxComponent {
  @Input() field: FormSelectableField = { id: 0, label: '', value: '' };
  @Input() isCheckedFn!: (value: any) => boolean;
  @Input() handleFn!: (field: any) => void;
  @Input() trackByFn!: (index: number, item: any) => any;
}
