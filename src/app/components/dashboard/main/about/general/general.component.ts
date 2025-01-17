import { Component, OnInit } from '@angular/core';
import { AboutusService } from '../../servicesApi/aboutus.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SpinnerService } from '../../../../../shared/services/spinner.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LandingService } from '../../servicesApi/landing.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

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

  constructor(
    private _AboutusService:AboutusService,
    private router : Router,
    private _SpinnerService: SpinnerService,
    private translate: TranslateService,
    private landingService: LandingService
  ){
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
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
    }
  }

  ngOnInit(): void {
    this.getAllWebsiteAbout();
    this.landingService.sliderData$.subscribe((data) => {
      console.log(data);
      
      this.aboutData = data[0];
      
    });
  }

  gettingAboutInfo(){
    console.log("test");
    
    this._SpinnerService.showSpinner();
    this._AboutusService.aboutGeneralInfo().subscribe({
      next : (res)=>{
        console.log(res);
        
        console.log(res.result[0]);
        this.websiteAboutUs = res.result[0]?.websiteAboutUs;
        this.listWebsiteAboutUsBranchs = res.result[0]?.listWebsiteAboutUsBranchs;
        this.listWebsiteAboutUsDept = [...res.result[0]?.listWebsiteAboutUsDept];
        this._SpinnerService.hideSpinner();
      },
      error : (err)=>{
        this._SpinnerService.hideSpinner();
      }
    })
  }

  getAllWebsiteAbout() {
    this.landingService.getAllWebsiteAbout('Propertyuae').subscribe({
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
