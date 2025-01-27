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

@Component({
  selector: 'app-service-inner',
  standalone: true,
  imports: [CommonModule, ToastModule, FormsModule, ReactiveFormsModule,TranslateModule,RouterModule,DialogModule],
  templateUrl: './service-inner.component.html',
  styleUrl: './service-inner.component.scss',
  providers: [MessageService]
})
export class ServiceInnerComponent implements OnInit{
  requestForm: FormGroup;
  tenancyName: string;
  item: any;
  currentLang: string;
  isSubmitted: boolean = false;
  displayDialog: boolean =false;
  logoImg: any;

  constructor(
     private landingService: LandingService,
        private _SpinnerService: SpinnerService,
        private router: Router,
        private messageService: MessageService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
  ){
    
    let hostname = window.location.hostname;
    if (hostname.includes('localhost')) {
      this.tenancyName = 'Propertyuae';
    } else {
      this.tenancyName = hostname.split(".")[0]; 
    }



      this.requestForm = this.fb.group({
        requesterName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobileNo: ['', Validators.required],
        companyName: ['', Validators.required],
        notes: [''],
        requestBDTypeLkpId: [41892],
        crmServiceId: [null],
        crmProjectId: [null],
        crmProductId: [null],
        // tenancyName :[ this.tenancyName]
        tenancyName :[ 'Propertyuae']
      });

      this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: { [x: string]: any; }) => {
      let id = params['itemAliasName']; // Access visitId from the URL
      console.log("iidd = ",id,params);
      
      this.getItemDetails(id);

    });
    this.landingService.sliderData$.subscribe(res=>{
      this.logoImg =  res[0]?.filepath ;
    })
  }
  getItemDetails(eliasName:any){
    this._SpinnerService.showSpinner();
    this.landingService.getServiceDetails("Propertyuae",eliasName).subscribe({
      next: (res)=>{
        console.log(res);
        
        this.item = res.result;
        this.requestForm.patchValue({
          crmServiceId : this.item?.id
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
