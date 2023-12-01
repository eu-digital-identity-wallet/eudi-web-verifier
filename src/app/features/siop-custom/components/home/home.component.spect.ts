import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

describe('CBOR selectable HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				WalletLayoutComponent,
				RouterModule,
				SharedModule
			],
			declarations: [ HomeComponent ]
		})
			.compileComponents();

		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
