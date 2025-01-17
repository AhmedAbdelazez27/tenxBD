import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LandingService {
  private baseUrl = 'http://compassint.ddns.net:2027/api/services/app/';
  
  // BehaviorSubject to hold slider data
  private sliderDataSubject = new BehaviorSubject<any>({});
  
  // Observable to expose the data
  public sliderData$ = this.sliderDataSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  // Fetch data from API
  getSlider(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}CrmWebsiteBDSetup/GetAllForWebsite?TenancyName=Propertyuae`)
      .pipe(
        tap((data) => {
          // Update BehaviorSubject with the fetched data
          this.sliderDataSubject.next(data.result || {}); // Assuming the data is under `result`
        })
      );
  }

  // Expose a method to fetch the current value of slider data (optional)
  getCurrentSliderData(): any {
    return this.sliderDataSubject.getValue();
  }

  getProducts(companyName:string): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}CrmProducts/GetAllForWebsite?TenancyName=${companyName}`)
  }

  getProjects(companyName:string): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}CrmProjects/GetAllForWebsite?TenancyName=${companyName} `)
  }

  getServices(companyName:string): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}CrmServices/GetAllForWebsite?TenancyName=${companyName}`)
  }

  getAllWebsiteAbout(companyName:string): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}CrmAboutUs/GetByTenantName?tenantName=${companyName}`)
  }
  
  submitRequest(finalData:any): Observable<any>{
      return this.http.post<any>(`${this.baseUrl}CRMBDRequests/CreateForERP`,finalData)
    }

  submitRequestContact(finalData:any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}CrmContactUs/CreateByTenancyName`,finalData)
  }







  getAllCouncils(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}WebsiteHallsCouncils/GetAllWebsiteHallsCouncils?HallsCouncilsTypeLkpId=12451`)
  }

  getSingleHallCouncils(id:any): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}WebsiteHallsCouncils/GetDetailForWebsiteById?Id=${id}`)
  }

  getAllTmAutoCouponsForWebsite(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}TmAutoCoupons/GetAllTmAutoCouponsForWebsite`)
  }

  getAllPartnersForWebsite():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}WebsiteOurPartners/GetAllWebsiteOurPartnersForWebsite `)
  }

}
