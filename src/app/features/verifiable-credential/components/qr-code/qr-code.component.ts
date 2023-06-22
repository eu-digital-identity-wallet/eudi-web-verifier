import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { DataService } from '@app/core/services/data.service';

declare let QRCode: any;

@Component({
	selector: 'vc-qr-code',
	standalone: true,
	imports: [CommonModule, SharedModule],
	templateUrl: './qr-code.component.html',
	styleUrls: ['./qr-code.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit {
	constructor (
    // private readonly presentationDefinitionService: {
    //   client_id: string,
    //   request_uri: string
    // },
    private readonly dataService: DataService
	) {}

	ngOnInit (): void {
		const data = this.dataService.QRCode;
		console.log('data: => ', data);
		this.displayJWTObject = false;
		this.displayButtonJWTObject = false;
		this.presentationDefinition = data;
		new QRCode(document.getElementById('qrcode'), data.request_uri);
	}

	requestGenerate = false;
	// @Input() set presentationDefinition$ (request: Observable<{
	//   client_id: string,
	//   request_uri: string
	// }>) {
	// 	this.displayJWTObject = false;
	// 	this.displayButtonJWTObject = false;
	// 	if (request) {
	// 		request.
	// 			pipe(
	// 				tap((data: {
	//           client_id: string,
	//           request_uri: string
	//         }) => {
	// 					this.displayJWTObject = false;
	// 					this.displayButtonJWTObject = false;
	// 					this.presentationDefinition = data;
	// 					new QRCode(document.getElementById('qrcode'), data.request_uri);
	// 					this.changeDetectorRef.detectChanges();
	// 				})
	// 			).subscribe();
	// 	}
	// }

	JwtObject!: string;
	displayJWTObject = false;
	displayButtonJWTObject = false;

	presentationDefinition!: {
    client_id: string,
    request_uri: string
  };

	obtainCredential () {
  	this.displayButtonJWTObject = false;
  	// this.presentationDefinitionService.requestCredentialByJWT(this.presentationDefinition.request_uri)
  	// 	.pipe(
  	// 		catchError((error) => {
  	// 			let message = 'An error occurred while processing your request.';
  	// 			if (error.status === 400) {
  	// 				message = 'The JWT has been already fetched.';
  	// 			}
  	// 			return of({
  	// 				error: message
  	// 			});
  	// 		})
  	// 	)
  	// 	.subscribe((jwt) => {
  	// 		this.displayButtonJWTObject = true;
  	// 		this.JwtObject = JSON.stringify(jwt, null, 2);
  	// 		this.displayJWTObject = true;
  	// 		this.changeDetectorRef.detectChanges();
  	// });
	}
	async copyToClipboard () {
  	try {
  		await navigator.clipboard.writeText(this.presentationDefinition.request_uri);
  	} catch (err) {
  		console.error('Failed to copy: ', err);
  	}
	}
}
