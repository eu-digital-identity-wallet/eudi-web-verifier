import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { DataService } from '@app/core/services/data.service';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { ReplaySubject, Subject, catchError, interval, of, takeUntil } from 'rxjs';
import { JWT } from '@app/features/presentation-definition/models/JWT';
import { NavigateService } from '@app/core/services/navigate.service';

declare let QRCode: any;

@Component({
	selector: 'vc-qr-code',
	standalone: true,
	imports: [CommonModule, SharedModule],
	templateUrl: './qr-code.component.html',
	styleUrls: ['./qr-code.component.scss'],
	providers: [PresentationDefinitionService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit, OnDestroy {
	constructor (
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService,
    private readonly changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnDestroy (): void {
		this.destroy$.unsubscribe();
		this.dataService.setQRCode('');
	}

	ngOnInit (): void {
		const data = this.dataService.QRCode;

		if (!data) {
			this.navigateService.goHome();
		}
		this.displayJWTObject = false;
		this.displayButtonJWTObject = false;
		this.presentationDefinition = data;
		new QRCode(document.getElementById('qrcode'), data.request_uri);
		this.pollingRequest(data.presentation_id,'nonce');
	}
	destroy$ = new Subject();
  @ViewChild('qrCode')	qrCode!: ElementRef;
  responseData = false;
  requestGenerate = false;
  hasResult = false;

  results!: string;
  JwtObject!: string;
  displayJWTObject = false;
  displayButtonJWTObject = false;

  presentationDefinition!: {
    client_id: string,
    request_uri: string
    presentation_id: string
  };

  pollingRequest (presentation_id: string, nonce: string) {
  	const source = interval(2000);
  	const stopPlay$ = new ReplaySubject(1);
  	source
  		.pipe(takeUntil(stopPlay$))
  		.subscribe(() => {
  		this.presentationDefinitionService.getWalletResponse(presentation_id,nonce).
  				pipe(takeUntil(this.destroy$))
  				.subscribe(
  				res =>{
  					this.results = res;
  					const divElement = this.qrCode.nativeElement;
  					divElement.style.display='none';
  					this.hasResult = true;
  					this.changeDetectorRef.detectChanges();
  					stopPlay$.next(1);
  				},
  			);
  		});
  }

  authentication () {
  	this.displayButtonJWTObject = false;
  	this.presentationDefinitionService.requestCredentialByJWT(this.presentationDefinition.request_uri)
  		.pipe(
  			catchError((error) => {
  				let message = 'An error occurred while processing your request.';
  				if (error.status === 400) {
  					message = 'The JWT has been already fetched.';
  				}
  				return of({
  					error: message
  				});
  			})
  		)
  		.subscribe((jwt: JWT | any) => {
  			this.displayButtonJWTObject = true;
  			this.JwtObject = JSON.stringify(jwt, null, 2);
  			this.displayJWTObject = true;
  			this.submitWalletResponse(jwt.state);
  			this.changeDetectorRef.detectChanges();
  	});
  }

  submitWalletResponse (state: string) {
  	this.presentationDefinitionService.submitWalletResponse(state).subscribe();
  }

  async copyToClipboard () {
  	try {
  		await navigator.clipboard.writeText(this.presentationDefinition.request_uri);
  	} catch (err) {
  		console.error('Failed to copy: ', err);
  	}
  }
}
