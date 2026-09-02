import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true
})
export class UppercaseDirective implements OnInit {
  constructor(
    private el: ElementRef<HTMLInputElement>,
    private ngControl: NgControl
  ) {}

  ngOnInit() {
    const control = this.ngControl.control;
    if (control && control.value) {
      const upperValue = control.value.toUpperCase();
      if (control.value !== upperValue) {
        control.setValue(upperValue, { emitEvent: false });
        this.el.nativeElement.value = upperValue;
      }
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    
    input.value = upperValue;
    
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(upperValue, { emitEvent: false });
    }
  }
}