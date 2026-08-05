import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

import { PresentationOptionsRegistrationCertificateComponent, RegistrationCertificatePresentationOptionsChangedEvent } from './presentation-options-registration-certificate.component';
import { VerifierEndpointService } from '@app/core/services/verifier-endpoint.service';
import { IntendedUse } from '@app/core/models/IntendedUse';

const mockIntendedUses: IntendedUse[] = [
  { intended_use_id: 'use-1', description: 'First use', registration_certificate: 'xxx.yyy.zzz' },
  { intended_use_id: 'use-2', description: 'Second use', registration_certificate: 'xxx.yyy.zzz'},
];

describe('PresentationOptionsRegistrationCertificateComponent', () => {
  let component: PresentationOptionsRegistrationCertificateComponent;
  let fixture: ComponentFixture<PresentationOptionsRegistrationCertificateComponent>;
  let verifierEndpointServiceSpy: jasmine.SpyObj<VerifierEndpointService>;

  beforeEach(async () => {
    verifierEndpointServiceSpy = jasmine.createSpyObj<VerifierEndpointService>('VerifierEndpointService', ['getIntendedUses']);
    verifierEndpointServiceSpy.getIntendedUses.and.returnValue(of(mockIntendedUses));

    await TestBed.configureTestingModule({
      imports: [PresentationOptionsRegistrationCertificateComponent],
      providers: [
        provideNoopAnimations(),
        { provide: VerifierEndpointService, useValue: verifierEndpointServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PresentationOptionsRegistrationCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty intendedUses before fetch', () => {
    verifierEndpointServiceSpy.getIntendedUses.and.returnValue(of([]));
    const newFixture = TestBed.createComponent(PresentationOptionsRegistrationCertificateComponent);
    const newComponent = newFixture.componentInstance;
    expect(newComponent.intendedUses).toEqual([]);
  });

  it('should fetch intended uses on init and bind them', () => {
    expect(verifierEndpointServiceSpy.getIntendedUses).toHaveBeenCalled();
    expect(component.intendedUses).toEqual(mockIntendedUses);
  });

  it('should keep intendedUses as empty array on HTTP error', () => {
    verifierEndpointServiceSpy.getIntendedUses.and.returnValue(throwError(() => new Error('Network error')));
    const newFixture = TestBed.createComponent(PresentationOptionsRegistrationCertificateComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    expect(newComponent.intendedUses).toEqual([]);
  });

  it('should emit registrationCertificateOptionsChanged with registrationCertificate when input changes', () => {
    const emittedEvents: RegistrationCertificatePresentationOptionsChangedEvent[] = [];
    component.registrationCertificateOptionsChanged.subscribe((e) => emittedEvents.push(e));

    component.registrationCertificateControl.setValue('my-cert', { emitEvent: false });
    component.onRegistrationCertificateInput({ target: { value: 'my-cert' } } as unknown as Event);

    expect(emittedEvents.length).toBe(1);
    expect(emittedEvents[0].registrationCertificate).toBe('my-cert');
  });

  it('should emit registrationCertificateOptionsChanged with intendedUseId when selection changes', () => {
    const emittedEvents: RegistrationCertificatePresentationOptionsChangedEvent[] = [];
    component.registrationCertificateOptionsChanged.subscribe((e) => emittedEvents.push(e));

    component.intendedUseControl.setValue('use-1', { emitEvent: false });
    component.onIntendedUseSelectionChange({ value: 'use-1' } as MatSelectChange);

    expect(emittedEvents.length).toBe(1);
    expect(emittedEvents[0].intendedUseId).toBe('use-1');
  });

  it('should emit undefined for empty registrationCertificate string', () => {
    const emittedEvents: RegistrationCertificatePresentationOptionsChangedEvent[] = [];
    component.registrationCertificateOptionsChanged.subscribe((e) => emittedEvents.push(e));

    component.onRegistrationCertificateInput({ target: { value: '' } } as unknown as Event);

    expect(emittedEvents.length).toBe(1);
    expect(emittedEvents[0].registrationCertificate).toBeUndefined();
  });

  it('should emit undefined for null intendedUseId', () => {
    const emittedEvents: RegistrationCertificatePresentationOptionsChangedEvent[] = [];
    component.registrationCertificateOptionsChanged.subscribe((e) => emittedEvents.push(e));

    component.intendedUseControl.setValue(null, { emitEvent: false });
    component.onIntendedUseSelectionChange({ value: null } as MatSelectChange);

    expect(emittedEvents.length).toBe(1);
    expect(emittedEvents[0].intendedUseId).toBeUndefined();
  });

  it('should clear intendedUseControl when registrationCertificate is entered', () => {
    component.intendedUseControl.setValue('use-1', { emitEvent: false });
    component.onRegistrationCertificateInput({ target: { value: 'my-cert' } } as unknown as Event);

    expect(component.intendedUseControl.value).toBeNull();
  });

  it('should clear registrationCertificateControl when intendedUse is selected', () => {
    component.registrationCertificateControl.setValue('my-cert', { emitEvent: false });
    component.onIntendedUseSelectionChange({ value: 'use-1' } as MatSelectChange);

    expect(component.registrationCertificateControl.value).toBe('');
  });
});
