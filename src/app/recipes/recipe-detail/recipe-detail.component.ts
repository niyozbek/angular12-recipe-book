import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer'
import * as RecipesActions from '../store/recipe.actions'
import { map, switchMap } from 'rxjs/operators';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>

    ) {  }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => {
        return +params['id']
      }),
      switchMap(id => {
        this.id = id
        return this.store.select('recipes')
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => index === this.id)
      })
    ).subscribe(recipe => {
      this.recipe = recipe
    })
  }

  addIngredientsToShoppingList(){
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
    // this.recipeService.addBulk(this.recipe.ingredients)
    // console.log(this.shoppingListService.getIngredients())
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route})

    // more complex way to demo possibilities
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route})
  }

  onDeleteRecipe(){
    // this.recipeService.deleteRecipe(this.id)
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['../'], {relativeTo: this.route})
  }

}
