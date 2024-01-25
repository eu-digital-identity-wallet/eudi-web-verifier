import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, OnDestroy, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { DataService } from '@app/core/services/data.service';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { ReplaySubject, Subject, interval, take, takeUntil, of, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { NavigateService } from '@app/core/services/navigate.service';
import { PresentationDefinitionResponse } from '@app/core/models/presentation-definition-response';
import { CborDecodeService } from '@app/core/services/cbor/cbor-decode.service';
import { TransformedResponse } from '../../models/TransformedResponse';
import { WalletResponse } from '../../models/WalletResponse';
import { JWTService } from '@app/core/services/jwt.service';
import { environment } from '@environments/environment';
import { PresentationsResultsComponent } from '../presentations-results/presentations-results.component';
import { DeviceDetectorService } from '@app/core/services/device-detector.service';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import * as constants from '@core/constants/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let QRCode: any;

@Component({
	selector: 'vc-qr-code',
	standalone: true,
	imports: [CommonModule, SharedModule, PresentationsResultsComponent],
	templateUrl: './qr-code.component.html',
	styleUrls: ['./qr-code.component.scss'],
	providers: [PresentationDefinitionService, CborDecodeService, JWTService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit, OnDestroy {

	destroy$ = new Subject();
	stopPlay$ = new ReplaySubject(1);
  @ViewChild('qrCode')	qrCode!: ElementRef;
  hasResult = false;

  results: TransformedResponse = {
  	vpToken: [],
  	idToken: []
  };
  displayButtonJWTObject = false;
  presentationDefinition!: PresentationDefinitionResponse;

  redirectUrl!: string;
  private readonly deviceDetectorService!: DeviceDetectorService;
  private readonly jWTService!: JWTService;
  private readonly localStorageService!: LocalStorageService;
  constructor (
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly cborDecodeService: CborDecodeService,
    private readonly injector: Injector,
  ) {
  	this.deviceDetectorService = this.injector.get(DeviceDetectorService);
  	this.jWTService = this.injector.get(JWTService);
  	this.localStorageService = this.injector.get(LocalStorageService);
  }

  ngOnInit (): void {
  	this.presentationDefinition = this.dataService.QRCode as PresentationDefinitionResponse;

  	if (!this.presentationDefinition) {
  		this.navigateService.goHome();
  	} else {
  		this.displayButtonJWTObject = false;
  		this.redirectUrl = this.buildQrCode(this.presentationDefinition);

  		this.setUpQrCode(this.redirectUrl);
  		if (this.deviceDetectorService.isDesktop()) {
  			this.pollingRequest(this.presentationDefinition.presentation_id);
  		}
  	}
  }

  setUpQrCode (qr: string) {
  	new QRCode(document.getElementById('qrcode'), {
  		text: qr,
  		correctLevel: QRCode.CorrectLevel.L,
  	});
  }

  pollingRequest (presentation_id: string) {
  	const source = interval(2000);
  	source
  		.pipe(
  			takeUntil(this.stopPlay$),
  			take(60)
  		)
  		.subscribe(() => {
  		this.presentationDefinitionService.getWalletResponse(presentation_id).
  				pipe(
  					takeUntil(this.stopPlay$),
  					map((data) => data as WalletResponse),
  					switchMap((res: WalletResponse) => {
  						return forkJoin({
  							vpToken: res.vp_token ? this.cborDecodeService.decode(res.vp_token) : of([]),
  							idToken: res.id_token ? this.jWTService.decode(res.id_token) : of([]),
  						}).pipe(
  							take(1)
  						);
  					}),
  				)
  				.subscribe(
  				(res: TransformedResponse) =>{
  						this.results = res;
  						const divElement = this.qrCode.nativeElement;
  						divElement.style.display='none';
  						this.hasResult = true;
  						this.changeDetectorRef.detectChanges();
  						this.localStorageService.remove(constants.UI_PRESENTATION);
  						this.stopPlay$.next(1);
  				},
  			);
  		});
  }

  async copyToClipboard () {
  	try {
  		await navigator.clipboard.writeText(this.buildQrCode(this.presentationDefinition));
  	} catch (err) {
  		console.error('Failed to copy: ', err);
  	}
  }
  private buildQrCode (data: {client_id: string, request_uri: string, presentation_id: string}): string {
  	let builtURL = `${environment.apiUrl}?client_id=${data.client_id}&request_uri=${encodeURIComponent(data.request_uri)}`;
  	builtURL = builtURL.replace('https', 'eudi-openid4vp');
  	return builtURL;
  }

  goToLink (url: string) {
  	window.open(url, '_blank');
  }

  ngOnDestroy (): void {
  	// this.localStorageService.remove(constants.UI_PRESENTATION);
  	this.destroy$.next('');
  	this.destroy$.complete();
  	this.stopPlay$.next('');
  	this.stopPlay$.complete();
  	this.dataService.setQRCode(null);
  }
}
