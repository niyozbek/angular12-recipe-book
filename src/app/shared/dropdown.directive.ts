import { Directive, ElementRef, HostBinding, HostListener, Input, Renderer2 } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {

    // @HostBinding('class.open') defaultState: boolean = false;

    // @HostListener('click') toggleOpen() {
    //     this.defaultState = !this.defaultState
    // }

    // constructor(private elementRef: ElementRef, private renderer: Renderer2) {

    // }
    @HostBinding('class.open') isOpen = false;
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    }
    constructor(private elRef: ElementRef) { }

}
