import { Action } from "@ngrx/store"

export const LOGIN_START = '[Auth] Login Start'
export const AUTHENTICATE_SUCCESS = '[Auth] Login'
export const AUTHENTICATE_FAIL = '[Auth] Login Fail'
export const LOGOUT = '[Auth] Logout'
export const CLEAR_ERROR = '[Auth] Clear Error'
export const SIGNUP_START = '[AUTH] Signup Start'
export const AUTO_LOGIN = '[AUTH] Auto Login'


export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS

  constructor(
    public payload: {
      email: string
      localId: string
      idToken: string
      expirationDate: Date
      redirect: boolean
    }
  ) { }
}

export class Logout implements Action {
  readonly type = LOGOUT
}

export class LoginStart implements Action {
  readonly type = LOGIN_START

  constructor(public payload: { email: string, password: string }) { }
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL

  constructor(public payload: string) { }

}

export class SignupStart implements Action {
  readonly type = SIGNUP_START

  constructor(public payload: { email: string, password: string }) { }

}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR
}

export class AutoLogin implements Action{
  readonly type = AUTO_LOGIN
}

export type AuthActions =
| Logout
| AuthenticateSuccess
| AuthenticateFail
| LoginStart
| SignupStart
| ClearError
| AutoLogin

