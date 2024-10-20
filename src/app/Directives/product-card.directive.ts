import { Directive, ElementRef, HostListener, OnChanges } from '@angular/core';

@Directive({
  selector: '[appProductCard]'
})
export class ProductCardDirective {

  constructor(public elementRef: ElementRef) {
    this.elementRef.nativeElement.style.borderRadius = '10px';
    this.elementRef.nativeElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.8)';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)';
  }

  ngOnChanges(): void {
    this.elementRef.nativeElement.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)';
  }
}
