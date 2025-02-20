import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Makes it globally available
})
export class GlobalConfigService {
  readonly baseUrl: string = 'https://files.tenxerp.com/';

  constructor() {}
}
