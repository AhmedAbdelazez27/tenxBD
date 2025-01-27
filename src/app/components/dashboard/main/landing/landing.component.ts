import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { LandingService } from '../servicesApi/landing.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../../shared/services/cart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, CarouselModule, ToastModule, FormsModule, ReactiveFormsModule,TranslateModule,RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [MessageService]
})
export class LandingComponent implements OnInit {
  sliderItems: any[] = [];
  websiteStatistic: any[] = [];
  donationsItems: any[] = [];
  coupons: any[] = [];
  currentItemCart: any;
  projects: any[] = [];
  inputValue: number = 0; // Initialize the value
  selectedValue: number = 10; // Default selected value
  inputValueFast: number = 10; // Initialize the value

  // Owl carousel options
  customOptions?: OwlOptions;
  customOptionsServices?: OwlOptions;
  customOptionsPartners?: OwlOptions;
  currentLang: string;
  partners: any[]=[];
  sliderData: any[] = [];
  socialLinks :any;
  @ViewChild('owlCarousel', { static: false }) owlCarousel: any;
  @ViewChild('owlCarousel2', { static: false }) owlCarousel2: any;
  
  currentSection: string = 'slider';

navLinks = [
  { name: 'Home', fragment: 'slider' },
  { name: 'About', fragment: 'about' },
  { name: 'Products', fragment: 'products' },
  { name: 'Services', fragment: 'services' },
  { name: 'Projects', fragment: 'projects' },
  { name: 'Contact', fragment: 'contact' },
];
  productsItems: any[]=[];
  services: any[]=[];
  aboutInfo:any;
  requestForm: FormGroup;
  isSubmitted: boolean = false;
  requestBDTypeLkpId: any;
  contactForm: FormGroup;
  isSubmittedContact:boolean = false;
  tenancyName: string;
  logoImg: string='';

  constructor(
    private landingService: LandingService,
    private _SpinnerService: SpinnerService,
    private router: Router,
    private messageService: MessageService,
    private cartService: CartService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.requestForm = this.fb.group({
      requesterName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', Validators.required],
      companyName: ['', Validators.required],
      notes: ['']
    });

    // Initialize the reactive form
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone1 : ['', Validators.required],
      companyName: ['', Validators.required],
      message: ['', Validators.required] // Optional field
    });
    // Determine the language direction dynamically
    const currentLanguage = localStorage.getItem('language') || 'en'; // Assuming 'lang' in localStorage
    if (currentLanguage == 'ar') {

      this.customOptionsServices = {
        rtl: true, // Enable RTL for Owl Carousel
        loop: true,
        margin: 5,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive: {
          0: { items: 1 },
          600: { items: 1},
          1000: { items: 2},
        },
        navText: [ '<span class="navv">&lt;</span>', // Add custom class for "Previous"
          '<span class="navv">&gt;</span>']
      };
      this.customOptions = {
       ...this.customOptionsServices
      };
    } else {

      this.customOptionsServices = {
        loop: true,
        margin: 5,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          1000: {
            items: 2,
          },
        },
        navText: [ '<span class="navv">&lt;</span>', // Add custom class for "Previous"
          '<span class="navv">&gt;</span>'],
      };
      
      this.customOptions = {
        ...this.customOptionsServices,responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 3,
          },
        },
       };
    }
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
    console.log(this.currentLang);

    let hostname = window.location.hostname;
    if (hostname.includes('localhost')) {
      this.tenancyName = 'Propertyuae';
    } else {
      this.tenancyName = hostname.split(".")[0]; 
    }
  
    
  }
  ngOnInit(): void {
    this.gettingProducts();
    this.getListProjects();
    this.getAllWebService();
    this.getAllWebsiteAbout();
    // this.getAllPartnersForWebsite();
    this.landingService.sliderData$.subscribe((data) => {
      console.log(data);
      
      this.sliderData = data[0]?.crmWebsiteBDSetupSliderDtoList;
      this.socialLinks = {
        linkedInLink: data[0]?.linkedInLink,
        instagramLink: data[0]?.instagramLink,
        facebookLink: data[0]?.facebookLink
      }
      this.logoImg =  data[0]?.filepath ;
      console.log(this.sliderData);
      
    });
  }

  scrollToSection(sectionId: string) {
    const sections = document.querySelectorAll('div[id^="section"]');
    sections.forEach(section => section.classList.remove('active-section'));
    this.currentSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.classList.add('active-section');
    }
  }

  navigateNext() {
    this.owlCarousel.next(); // Navigate to the next slide
  }

  navigatePrev() {
    this.owlCarousel.prev(); // Navigate to the previous slide
  }

  navigateNext2() {
    this.owlCarousel2.next(); // Navigate to the next slide
  }

  navigatePrev2() {
    this.owlCarousel2.prev(); // Navigate to the previous slide
  }

  updateValue() {
    console.log(this.selectedValue);
    setTimeout(() => {
      this.inputValueFast = this.selectedValue;
    }, 200);
    console.log(this.inputValueFast);

  }

  gettingProducts() {
    this.landingService.getProducts("Propertyuae").subscribe({
      next: (res) => {
        this.productsItems = res.result.filter((item: { isActive: any; }) => item.isActive);
      },
      error: (err) => {
      }
    })
  }

  getListProjects() {
    this.landingService.getProjects('Propertyuae').subscribe({
      next: (res) => {
        this.projects = res.result;
      },
      error: (err) => {
      }
    })
  }
  animatedValues: number[] = []; // Array to store animated values
  getAllWebService() {
    this.landingService.getServices('Propertyuae').subscribe({
      next: (res:any) => {
        let baseServices = [...res.result];
        
        for (let i = 0; i < baseServices.length; i += 2) {
          this.services.push(baseServices.slice(i, i + 2));
        }
        console.log(this.services);
        
      }
    })
  }

  goDetailsEmergency(emergencyId: any) {
    this.router.navigate([`Main/Emergency/Details/${emergencyId}`]);
  }


  animateCounter(
    startValue: number,
    endValue: number,
    duration: number,
    callback: (currentValue: number) => void
  ): void {
    const stepTime = 10;
    const step = (endValue - startValue) / (duration * 100);
    let current = startValue;

    const intervalId = setInterval(() => {
      current += step;

      if (current >= endValue) {
        callback(endValue);
        clearInterval(intervalId);
      } else {
        callback(Math.floor(current));
      }
    }, stepTime);
  };

  getAllWebsiteAbout() {
    this.landingService.getAllWebsiteAbout('Propertyuae').subscribe({
      next: (res) => {
        this.aboutInfo = res.result[0];
      }
    })
  };

  getAllPartnersForWebsite() {
    this.landingService.getAllPartnersForWebsite().subscribe({
      next: (res) => {
        this.partners = res.result;
        console.log(this.partners);
        
      }
    })
  };

  goDetails(route: string) {
    this.router.navigate([`${route}`]);
  };

  selectCurrentItem(item: any,typeV?: string) {
    console.log(item);
    this.requestBDTypeLkpId = typeV === 'product' 
    ? 41891 
    : typeV === 'service' 
    ? 41892 
    : typeV === 'project' 
    ? 41893 
    : null;
    this.currentItemCart = { ...item, typeV }
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

  onSubmit(): void { 
    this.isSubmitted = true;
  
    if (this.requestForm.valid) {
      this._SpinnerService.showSpinner();
      // Set IDs based on type flag
      const crmProjectId = this.currentItemCart?.typeV === 'project' ?  this.currentItemCart?.id: null;
      const crmServiceId = this.currentItemCart?.typeV === 'service' ? this.currentItemCart?.id : null;
      const crmProductId = this.currentItemCart?.typeV === 'product' ? this.currentItemCart?.id : null;
  
      // Prepare the final data object
      const finalData = {
        ...this.requestForm.value, // Form fields (name, email, etc.)
        crmProjectId,
        crmServiceId,
        crmProductId,
        tenancyName:this.tenancyName, // Include the tenancy name
        requestBDTypeLkpId : this.requestBDTypeLkpId
      };
  
      console.log('Form Submitted:', finalData);

      this.landingService.submitRequest(finalData).subscribe({
        next: (response) => {
          console.log('Request submitted successfully:', response);
          this.closeModal();
          this.showSuccess();
          this._SpinnerService.hideSpinner();
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
  closeModal(): void {
    const closeBtn = document.getElementById('hiddenCloseBtn');
    if (closeBtn) {
      closeBtn.click();
    }
  }

  onSubmitContact(): void {
    this.isSubmittedContact = true;

    if (this.contactForm.valid) {
      console.log('Form Data:', this.contactForm.value);
      this._SpinnerService.showSpinner();
      const finalData = {
        ...this.contactForm.value,
        tenancyName :'Propertyuae',
      }
 
      this.landingService.submitRequestContact(finalData).subscribe( {
        next : response =>{
          this.showSuccess();
          this._SpinnerService.hideSpinner();
          this.contactForm.reset();
          console.log('Form submitted successfully:', response);
        },
        error : err=>{
          this._SpinnerService.hideSpinner();
          this.handleFailure();
          console.error('Error submitting request:', err);
        }
      });
    } else {
      // this.handleFailure();
      console.warn('Form is invalid');
    }
  }
}
