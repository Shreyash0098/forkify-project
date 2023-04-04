import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class SearchResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found like this';
  _successMsg = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new SearchResultView();
