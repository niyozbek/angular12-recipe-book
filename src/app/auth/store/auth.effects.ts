import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { environment } from '../../../environments/environment'
import { AuthService } from '../auth.service'
import { User } from '../user.model'

import * as AuthActions from './auth.actions'

export interface AuthResponseData {
  kind: string
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}

const handleAuthentication = (email: string, localId: string, idToken: string, expiresIn: string) => {
  const expirationDuration = new Date(
    new Date().getTime() + +expiresIn * 1000
  )

  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000)
  const user = new User(email, localId, idToken, expirationDate)

  localStorage.setItem('userData', JSON.stringify(user))
  return new AuthActions.AuthenticateSuccess({
    email: email,
    localId: localId,
    idToken: idToken,
    expirationDate: expirationDate,
    redirect: true
  })
}

const handleError = (errorResponse) => {
  // error handling code
  let errorMessage = 'An unknown error occurred!'
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage))
  }
  // console.log(errorResponse.error.error.message)

  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already.'
      break
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.'
      break
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.'
      break
  }
  return of(new AuthActions.AuthenticateFail(errorMessage))
}

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000)
        }),
        map(resData => {
          return handleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn)
        }),
        catchError(errorResponse => {
          return handleError(errorResponse)
        })
      )
    })
  )

  // this authLogin observable should never die, therefore never throw error
  @Effect()
  authLogin = this.actions$.pipe(
    // login start triggers this authLogin
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000)
        }),
        map(resData => {
          return handleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn)
        }),
        catchError(errorResponse => {
          return handleError(errorResponse)
        })
      )
    }),


  )

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if(authSuccessAction.payload.redirect){
        this.router.navigate(['/'])
      }
    })
  )

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string
        id: string
        _token: string
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'))
      if (!userData) {
        return { type: 'DUMMY' }
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      )

      if (loadedUser.token) {

        // this.user.next(loadedUser)
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
        this.authService.setLogoutTimer(expirationDuration)
        // console.log({
        //   email: loadedUser.email,
        //   localId: loadedUser.id,
        //   idToken: loadedUser.token,
        //   expirationDate: new Date(userData._tokenExpirationDate)
        // })

        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          localId: loadedUser.id,
          idToken: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        })

        // const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
        // this.autoLogout(expirationDuration)
      }
      return { type: 'DUMMY' }
    })
  )

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer()
      localStorage.removeItem('userData')
      this.router.navigate(['/auth'])
    })
  )

  // $ - observable, optional
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }
}
