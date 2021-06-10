import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})

export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true
  isLoading = false
  error: string = null
  @ViewChild(PlaceHolderDirective, { static: false }) alertHost: PlaceHolderDirective
  private closeSub: Subscription
  private storeSub: Subscription

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(){
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading
      this.error = authState.authError
      if(this.error){
        this.showErrorAlert(this.error)
      }
    })
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return
    }

    // console.log(authForm)
    const email = authForm.value.email
    const password = authForm.value.password

    if (this.isLoginMode) {
      // ...
      // authObs = this.authService.login(email, password)
      this.store.dispatch(new AuthActions.LoginStart({
        email: email,
        password: password,
      }))
    } else {
      this.store.dispatch(new AuthActions.SignupStart({
        email: email,
        password: password,
      }))
    }
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError())
  }

  private showErrorAlert(message: string) {
    // angular doesnt get it
    // const alertComponent = new AlertComponent()
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
    const hostViewContainerRef = this.alertHost.viewContainerRef
    hostViewContainerRef.clear()

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory)

    componentRef.instance.message = message
    // only exception to subscribe to eventemitter
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      hostViewContainerRef.clear()
    })
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
    if (this.storeSub){
      this.storeSub.unsubscribe()
    }
  }
}
