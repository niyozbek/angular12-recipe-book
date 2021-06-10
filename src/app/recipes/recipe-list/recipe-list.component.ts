import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer'
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[]
  subscription: Subscription

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.subscription = this.store
      .select('recipes')
      .pipe(map(recipesState => recipesState.recipes))
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes
        }
      )
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe()
  }
}
