import { Component, OnInit, Renderer2, RendererFactory2, RendererStyleFlags2 } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CartService } from './shared/services/cart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LandingService } from './components/dashboard/main/servicesApi/landing.service';
import { SpinnerService } from './shared/services/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,NgxSpinnerModule,TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  private renderer: Renderer2;
  constructor(
    private cartService: CartService,
    private translate: TranslateService,
    private landingService:LandingService,
    private _SpinnerService: SpinnerService,
    rendererFactory: RendererFactory2,
  ){
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initLanguage();
  }
  ngOnInit(): void {
    this._SpinnerService.showSpinner();
     // Fetch slider data once at app initialization
     this.landingService.getSlider().subscribe({
      next : (res)=>{
        console.log("res = ",res?.result[0]?.themePrimaryColor);
        
        this.renderer.setStyle(document.documentElement, '--themePrimaryColor', res?.result[0]?.themePrimaryColor, RendererStyleFlags2.Important);
        this.renderer.setStyle(document.documentElement, '--themeSecondaryColor',res?.result[0]?.themeSecondaryColor , RendererStyleFlags2.Important);
        // this.renderer.setStyle(document.documentElement, variable, value);
        this._SpinnerService.hideSpinner();
      },
      error : (err)=>{
        this._SpinnerService.hideSpinner();
      }
     })
  }

  private initLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.translate.use(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      // this.loadStyleFile(savedLang);
    } else {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      localStorage.setItem('language', 'en');
      // this.loadStyleFile('en');
    }
  }

}
