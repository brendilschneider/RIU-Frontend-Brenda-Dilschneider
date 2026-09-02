import { Directive, HostListener, ElementRef, OnInit, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true
})
export class UppercaseDirective implements OnInit {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly ngControl = inject(NgControl);

  ngOnInit(): void {
    const valueAccessor = this.ngControl.valueAccessor;
    if (!valueAccessor) return;

    const originalWriteValue = valueAccessor.writeValue.bind(valueAccessor);

    valueAccessor.writeValue = (value: any) => {
      const upperValue = typeof value === 'string' ? value.toUpperCase() : value;
      
      originalWriteValue(upperValue);

      if (typeof upperValue === 'string' && this.elementRef.nativeElement.value !== upperValue) {
        this.elementRef.nativeElement.value = upperValue;
      }
    };
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    const upperValue = input.value.toUpperCase();
    input.value = upperValue;

    if (start !== null && end !== null) {
      input.setSelectionRange(start, end);
    }

    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(upperValue, { emitEvent: false });
    }
  }
}