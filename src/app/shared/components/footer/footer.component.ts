import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LandingService } from '../../../components/dashboard/main/servicesApi/landing.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{
  socialLinks ?: { linkedInLink: any; instagramLink: any; facebookLink: any; email: any; addressAr: any;addressEn: any; tel: any;   twitterLink:any ; pinterest :any };
  currentLang: string;

  constructor(private landingService: LandingService ,private translate: TranslateService,){
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit(): void {
    this.landingService.sliderData$.subscribe((data) => {

      this.socialLinks = {
        linkedInLink: data[0]?.linkedInLink,
        instagramLink: data[0]?.instagramLink,
        facebookLink: data[0]?.facebookLink,
        email :  data[0]?.email,
        tel :  data[0]?.tel,
        addressAr :  data[0]?.addressAr,
        addressEn :  data[0]?.addressEn,
        twitterLink : data[0]?.twitterLink,
        pinterest : data[0]?.pinterest,
      }
      
    });
  }

}
