import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SpinnerService } from '../../../../../shared/services/spinner.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LandingService } from '../../servicesApi/landing.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TranslationService } from '../../../../../shared/services/translation.service';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule,TranslateModule,CarouselModule,RouterLink],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit{
  websiteAboutUs:any;
  listWebsiteAboutUsBranchs:any;
  listWebsiteAboutUsDept:any;
  currentLang: string;
  aboutData: any;
  aboutInfo: any;
  customOptions?: OwlOptions;
  teams:any;
  logoImg: any;
  isRtl : boolean=false;
  tenancyName: string;

  constructor(
    private router : Router,
    private _SpinnerService: SpinnerService,
    private translate: TranslateService,
    private landingService: LandingService,
    private translationService : TranslationService
  ){
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
    this.isRtl =this.currentLang == 'ar' ? true :false ;
    if (this.currentLang == 'ar') {
      this.customOptions = {
        rtl: true, // Enable RTL for Owl Carousel
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
            items: 2,
          },
          1000: {
            items: 3,
          },
        },
        navText: [ '<span class="navv">&lt;</span>', // Add custom class for "Previous"
          '<span class="navv">&gt;</span>']
      };
    } else {
      this.customOptions = {
        loop: true,
        margin: 5,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        navText: [ '<span class="navv">&lt;</span>', // Add custom class for "Previous"
          '<span class="navv">&gt;</span>'],
        responsive: {
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
    };

    let hostname = window.location.hostname;
    if (hostname.includes('localhost')) {
      this.tenancyName = 'Propertyuae';
    } else {
      this.tenancyName = hostname.split(".")[0]; 
    }


  }

  ngOnInit(): void {
    this.getAllWebsiteAbout();
    this.landingService.sliderData$.subscribe((data) => {
      console.log(data);
      this.logoImg =  data[0]?.filepath ;
      this.aboutData = data[0];
      
    });
  }
  switchLanguage(lang: string) {
    this.translationService.changeLang(lang); // Call the translation service to change language
    this.currentLang = lang; // Update current language to reflect in the dropdown
  }

  getAllWebsiteAbout() {
    this.landingService.getAllWebsiteAbout(this.tenancyName).subscribe({
      next: (res) => {
        console.log(res);
        
        this.aboutInfo = res.result[0];
        this.teams = res.result[0]?.listCrmAboutUsMember

      }
    })
  };

  navigateToUrl(url:string): void {
    this.router.navigate([url]); // Replace with your desired route
  }
}
