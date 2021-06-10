import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions'
import * as fromApp from '../store/app.reducer';

@Injectable()

export class RecipeService {
  constructor(private store: Store<fromApp.AppState>) { }
  recipesChanged = new Subject<Recipe[]>()

  // recipeSelected = new EventEmitter<Recipe>()
  recipeSelected = new Subject<Recipe>()

  // recipes: Recipe[] = [
  //     new Recipe('Mac & Cheese', 'This is a good food', 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F5445825.jpg', [new Ingredient('Cheese', 10), new Ingredient('Macaroni', 15)]),
  //     new Recipe('Burger', 'Finger licking good', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80', [new Ingredient('Bun', 1), new Ingredient('Meat', 1)])
  // ];
  private recipes: Recipe[] = []

  getRecipes() {
    return this.recipes.slice()
  }

  getRecipe(index: number) {
    return this.getRecipes()[index]
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe)
    this.recipesChanged.next(this.getRecipes())
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe
    this.recipesChanged.next(this.getRecipes())
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1)
    this.recipesChanged.next(this.getRecipes())
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes
    this.recipesChanged.next(this.getRecipes())
  }

  addBulk(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
  }

}
