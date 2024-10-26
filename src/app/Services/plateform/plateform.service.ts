import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlateformService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  checkPlatform() {
    if (isPlatformBrowser(this.platformId)) {
      return true;
    } else {
      return false;
    }
  }
}
