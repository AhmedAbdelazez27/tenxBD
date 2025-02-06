import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LandingService } from '../../../servicesApi/landing.service';
import { SpinnerService } from '../../../../../../shared/services/spinner.service';
import { DialogModule } from 'primeng/dialog';
import { TranslationService } from '../../../../../../shared/services/translation.service';
import { GlobalConfigService } from '../../../../../../shared/services/shared/services/global-config.service';

@Component({
  selector: 'app-product-inner',
  standalone: true,
  imports: [CommonModule, ToastModule, FormsModule, ReactiveFormsModule,TranslateModule,RouterModule,DialogModule],  
  templateUrl: './product-inner.component.html',
  styleUrl: './product-inner.component.scss',
    providers: [MessageService]
})
export class ProductInnerComponent implements OnInit{
  requestForm: FormGroup;
  tenancyName: string;
  item: any;
  currentLang: string;
  isSubmitted: boolean = false;
  displayDialog: boolean =false;
  logoImg: any;
  isRtl = false; // Default to LTR (English)
  logoFullUrl: string;

  constructor(
     private landingService: LandingService,
        private _SpinnerService: SpinnerService,
        private router: Router,
        private messageService: MessageService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private translationService: TranslationService,
        private configService: GlobalConfigService
      ) {
        this.logoFullUrl = this.configService.baseUrl || "";
    let hostname = window.location.hostname;
    if (hostname.includes('localhost')) {
      this.tenancyName = 'compassint';
    } else {
      this.tenancyName = hostname.split(".")[0]; 
    }



      this.requestForm = this.fb.group({
        requesterName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobileNo: ['', Validators.required],
        companyName: ['', Validators.required],
        notes: [''],
        requestBDTypeLkpId: [41891],
        crmServiceId: [null],
        crmProjectId: [null],
        crmProductId: [null],
        tenancyName :[this.tenancyName]
      });

      this.currentLang = this.translate.currentLang || this.translate.defaultLang;
      console.log(this.currentLang);
      this.isRtl =this.currentLang == 'ar' ? true :false ;
      
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: { [x: string]: any; }) => {
      let id = params['itemAliasName']; // Access visitId from the URL
      
      this.getItemDetails(id);

    });
    this.landingService.sliderData$.subscribe(res=>{
      this.logoImg =  res[0]?.filepath ;
    })
  }

  switchLanguage(lang: string) {
    this.translationService.changeLang(lang); // Call the translation service to change language
    this.currentLang = lang; // Update current language to reflect in the dropdown
  }

  getItemDetails(eliasName:any){
    this._SpinnerService.showSpinner();
    this.landingService.getProductDetails(this.tenancyName,eliasName).subscribe({
      next: (res)=>{
        console.log(res);
        
        this.item = res.result;
        this.requestForm.patchValue({
          crmProductId : this.item?.id
        })
        this._SpinnerService.hideSpinner();
      },
      error: err=>{
        console.log(err);
        this._SpinnerService.hideSpinner();
      }
    })
  }

  onSubmit(): void { 
    this.isSubmitted = true;
  
    if (this.requestForm.valid) {
      this._SpinnerService.showSpinner();
      this.landingService.submitRequest(this.requestForm.value).subscribe({
        next: (response) => {
          console.log('Request submitted successfully:', response);
          this._SpinnerService.hideSpinner();
          this.displayDialog = true;
          // this.showSuccess();

        },
        error: (err) => {
          this._SpinnerService.hideSpinner();
          this.handleFailure();
          console.error('Error submitting request:', err);
        },
      });
  
    } else {
      console.warn('Form is invalid');
    }
  }

  showSuccess() {  
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('SUCCESS'),
      detail: this.translate.instant('REQUEST_SEND_SUCCESS'),
    });
  };
  
  // On Failure
  handleFailure(): void {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('FAILED'),
      detail: this.translate.instant('REQUEST_SEND_FAILED'),
    });
  };
  onDialogOkClick() {
    this.displayDialog = false;
    this.router.navigate(['/Main/Home']);
  }
}
