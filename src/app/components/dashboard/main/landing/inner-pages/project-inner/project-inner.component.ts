import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LandingService } from '../../../servicesApi/landing.service';
import { SpinnerService } from '../../../../../../shared/services/spinner.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-project-inner',
  standalone: true,
  imports: [CommonModule, ToastModule, FormsModule, ReactiveFormsModule,TranslateModule,RouterModule,DialogModule],
  templateUrl: './project-inner.component.html',
  styleUrl: './project-inner.component.scss',
  providers: [MessageService]
})
export class ProjectInnerComponent {
  requestForm: FormGroup;
  tenancyName: string;
  item: any;
  currentLang: string;
  isSubmitted: boolean = false;
  displayDialog: boolean =false;

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
        requestBDTypeLkpId: [41893],
        crmServiceId: [null],
        crmProjectId: [41893],
        crmProductId: [null],
        tenancyName :[ this.tenancyName]
      });

      this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: { [x: string]: any; }) => {
      let id = params['itemAliasName']; // Access visitId from the URL
      console.log("iidd = ",id,params);
      
      this.getItemDetails(id);

    });
  }
  getItemDetails(eliasName:any){
    this._SpinnerService.showSpinner();
    this.landingService.getProjectDetails(this.tenancyName,eliasName).subscribe({
      next: (res)=>{
        console.log(res);
        
        this.item = res.result;
        this.requestForm.patchValue({
          crmProjectId : this.item?.id
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
          this.showSuccess();

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