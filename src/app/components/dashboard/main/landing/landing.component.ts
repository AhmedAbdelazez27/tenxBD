import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { LandingService } from '../servicesApi/landing.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  products = [
    {
      name: 'Product 1',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      image: '/images/products/image-1.png',
    },
    {
      name: 'Product 2',
      description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
      image: '/images/products/image-2.png',
    },
    {
      name: 'Product 3',
      description: 'It has survived not only five centuries but also the leap into electronic typesetting.',
      image: '/images/products/image-3.png',
    },
  ];
  
  currentSection: string = 'slider';

navLinks = [
  { name: 'Home', fragment: 'slider' },
  { name: 'About', fragment: 'about' },
  { name: 'Products', fragment: 'products' },
  { name: 'Services', fragment: 'services' },
  { name: 'Projects', fragment: 'projects' },
  { name: 'Contact', fragment: 'contact' },
];


  constructor(
    private landingService: LandingService,
    private _SpinnerService: SpinnerService,
    private router: Router,
    private messageService: MessageService,
    private cartService: CartService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {
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
    
  }
  ngOnInit(): void {
    // this.gettingSliderData();
    this.getListProjects();
    // this.getAllWebsiteStatistic();
    // this.getAllTmAutoCouponsForWebsite();
    // this.getAllPartnersForWebsite();
    this.landingService.sliderData$.subscribe((data) => {
      console.log(data);
      
      this.sliderData = data[0]?.crmWebsiteBDSetupSliderDtoList;
      this.socialLinks = {
        linkedInLink: data[0]?.linkedInLink,
        instagramLink: data[0]?.instagramLink,
        facebookLink: data[0]?.facebookLink
      }
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
  gettingSliderData() {
    this._SpinnerService.showSpinner();
    this.landingService.getSlider().subscribe({
      next: (res) => {
        this.sliderItems = res.result.filter((item: { isActive: any; }) => item.isActive);
        this._SpinnerService.hideSpinner();
        this.gettingDonations();
      },
      error: (err) => {
        this.gettingDonations();
      }
    })
  }

  gettingDonations() {
    this.landingService.getDonations().subscribe({
      next: (res) => {
        this.donationsItems = res.result.filter((item: { isActive: any; }) => item.isActive);
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
  getAllWebsiteStatistic() {
    this.landingService.getAllWebsiteStatistic().subscribe({
      next: (res) => {
        this.websiteStatistic = res.result;

        // Initialize animation for each statistic
        this.websiteStatistic.forEach((stat, index) => {
          this.animateCounter(0, stat.value, 10, (currentValue) => {
            this.animatedValues[index] = currentValue;
          });
        });
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

  getAllTmAutoCouponsForWebsite() {
    this.landingService.getAllTmAutoCouponsForWebsite().subscribe({
      next: (res) => {
        this.coupons = res.result;
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

  selectCurrentItem(item: any, isRouting: boolean, typeV?: string) {
    console.log(item);

    this.currentItemCart = { ...item, isRouting, typeV }
  }


  addToCartDonation(item: any) {
    console.log(item);
    let cartItem: any;
    if (item?.typeV == 'Coupons') {

      cartItem = {
        id: item['id'],
        Image: item.filePath,
        Name: item.couponNameEn,
        Price: this.inputValue,
        Quantity: 1,
        Type: item?.typeV,
        ProjectName: null,
        ProjectNotes: null,
        SponsorshipFrom: null,
        PaymentOption: null
      };
    } else if (item?.typeV == 'Campaign') {
      cartItem = {
        id: item?.id,
        Image: item?.filePath,
        Name: item?.titleEn,
        Price: this.inputValue,
        Quantity: 1,
        Type: item?.typeV,
        ProjectName: null,
        ProjectNotes: null,
        SponsorshipFrom: null,
        PaymentOption: null
      };
    }

    // Retrieve existing items from localStorage
    let oldItems = JSON.parse(localStorage.getItem('items') || '[]');

    // Check if the item already exists
    let isItemFound = oldItems.some((existingItem: any) => existingItem.id === cartItem['id']);

    if (!isItemFound) {
      // Add the new item if it does not exist
      oldItems.push(cartItem);
      localStorage.setItem('items', JSON.stringify(oldItems));
      this.cartService.addToCart(cartItem);
      this.showSuccess();
      if (this.currentItemCart.isRouting) {
        console.log("routing here to cart");
        this.router.navigate(['/Main/Cart']);
      }
    } else {
      this.handleFailure();

    }
    this.inputValue = 0;
  }

  addToFastDonation(route: boolean) {
    let cartItem: any;

    cartItem = {
      id: null,
      Image: null,
      Name: "Fast",
      Price: this.inputValueFast,
      Quantity: 1,
      Type: "Fast Donation",
      ProjectName: null,
      ProjectNotes: null,
      SponsorshipFrom: null,
      PaymentOption: null
    };

    // Retrieve existing items from localStorage
    let oldItems = JSON.parse(localStorage.getItem('items') || '[]');

    // Add the new item if it does not exist
    oldItems.push(cartItem);
    this.cartService.addToCart(cartItem);
    localStorage.setItem('items', JSON.stringify(oldItems));
    this.showSuccess();
    if (route) {
      console.log("routing here to cart");
      this.router.navigate(['/Main/Cart']);
    }

    // this.inputValueFast = 10;
  }
  showSuccess() {  
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('SUCCESS'),
      detail: this.translate.instant('ADD_TO_CART_SUCCESS'),
    });
  };
  
  // On Failure
  handleFailure(): void {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('FAILED'),
      detail: this.translate.instant('ITEM_EXISTS_IN_CART'),
    });
  };

}
