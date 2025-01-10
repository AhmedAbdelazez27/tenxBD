import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LandingService } from '../../../components/dashboard/main/servicesApi/landing.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{
  socialLinks ?: { linkedInLink: any; instagramLink: any; facebookLink: any; };

  constructor(private landingService: LandingService){

  }

  ngOnInit(): void {
    this.landingService.sliderData$.subscribe((data) => {

      this.socialLinks = {
        linkedInLink: data[0]?.linkedInLink,
        instagramLink: data[0]?.instagramLink,
        facebookLink: data[0]?.facebookLink
      }
      
    });
  }

}
