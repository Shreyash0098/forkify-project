import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchView.js';
import searchResultView from './views/searchresultview.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksview.js';
import addrecipeView from './views/addrecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2/

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpiner();
    //0)update result view to make selected result
    searchResultView.update(model.getSearchResultPage());

    //(1)updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    ///(2)loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
    // console.log(recipe);

    ///(3)rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    //1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) load search result
    searchResultView.renderSpiner();
    await model.loadSearchResults(query);

    //3) render searchresult
    // searchResultView.render(model.state.search.results); ///before geneate page call like this
    searchResultView.render(model.getSearchResultPage());

    //4)render initional pagination
    paginationView.render(model.state.search);

    // console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};
controlSearchResult();

const controlPagination = function (gotoPage) {
  //3) render new searchresult
  searchResultView.render(model.getSearchResultPage(gotoPage));

  //4)render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newservings) {
  //update recpie servings (in state)
  model.updateServiengs(newservings);
  //update the recipe view
  recipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  //add and remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.rmvBookmark(model.state.recipe.id);
  //update recipe view
  recipeView.update(model.state.recipe);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addrecipeView.renderSpiner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success massage
    addrecipeView.renderSuccessMsg();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      // addrecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🎇', err);
    addrecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addhandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addrecipeView.addHandlerUplode(controlAddRecipe);
  console.log('welcome!');
};
init();

// window.addEventListener('hashchange',controlRecipes);
// window.addEventListener('load',controlRecipes);
