import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { ShoppingEditComponent } from "./shopping-list/shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

const appRoutes: Routes = [
  // {path: '', component: AppComponent},
  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full'
  },
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) },
  { path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }


  // {path: 'not-found', component: PageNotFoundComponent},
  // {path: 'not-found', component: ErrorPageComponent, data: {message: 'Page not found!'}},
  // {
  //   path: '**',
  //   redirectTo: '/not-found',
  //   pathMatch: 'full'
  // }
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: false, preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
