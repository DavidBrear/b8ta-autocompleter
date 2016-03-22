var React = require('react');

var WordAPI = require('./api/WordAPI.js');

var MIN_STRING_LENGTH = 3;

var AutoCompleter = React.createClass({

  propTypes: {
    onChange: React.PropTypes.func,
    placeholder: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      value: '',
      beginning: '',
      guess: '',
      focused: false
    };
  },
  getDefaultProps: function() {
    return {
      onChange: function() {},
      placeholder: 'Enter word to autocomplete'
    };
  },
  componentDidMount: function() {
    this._changing = false;
    this._knownWords = [];
    $(document).on('keydown', function(e) {
      if (e.keyCode === 9 && this.state.focused) {
        this._clearSelection();
        this._changing = false;
        return false;
      }
    }.bind(this));
  },
  render: function() {
    return (
      <textarea
        className='form-control'
        ref="autocompleter"
        placeholder={this.props.placeholder}
        onKeyDown={this._onKeyDown}
        onChange={this._onChange}
        onFocus={this._onFocus}
        onBlur={this._onBlur}
        onKeyUp={this._onKeyUp}>{this.props.initialValue}</textarea>
    );
  },
  _onFocus: function() {
    this.setState({
      focused: true
    });
  },
  _onBlur: function() {
    this.setState({
      focused: false
    });
  },
  _onKeyDown: function(e) {
    if (e.key === ' ') {
      this._changing = false;
      this.setState({
        guess: '',
        value: ''
      });
    }
  },
  _onChange: function(e) {
    this._changing = true;
    var value = e.target.value.split(' ');
    this.setState({
      value: value.pop(),
      beginning: value.join(' ')
    }, function() {
      this.props.onChange(e, [this.state.beginning, this.state.value].join(' ').trim());
    });
  },
  _onKeyUp: function(e) {
    if (this.state.value.length < MIN_STRING_LENGTH) return;

    if (this._checkSpecialKeys(e)) return;

    if (this._changing) {
      this._changing = false;
      if (this.state.guess.indexOf(this.state.value) >= 0) {
        this._setSelection();
      } else {
        var knownWord = this._searchKnown();
        if (knownWord) {
          this._setGuess(knownWord);
        } else {
          WordAPI.getWord(this.state.value)
          .then(function(respJson) {
            var word = respJson['word'];
            this._updateKnownWords(word);
            if (word.indexOf(this.state.value) < 0) { return; } // return if the guess is no longer applicable.
            this._setGuess(word);
          }.bind(this));
        }
      }
    }
  },
  _clearSelection: function() {
    /*
     * _clearSelection is called when we want to accept the highlighted word.
     */
    var len = this.refs.autocompleter.value.length
    this.refs.autocompleter.setSelectionRange(len, len, 'backward');
  },
  _checkSpecialKeys: function(e) {
    /*
     * _checkSpecialKeys returns true or false as to whether this was a special key that we need to
     * operate on. These special keys are Esc, Enter, and Backspace.
     */
    if (e.key === 'Enter' || e.key === 'Escape') {
      this._clearSelection();
      return true;
    }
    if (e.key === 'Backspace') return true;

    return false;
  },
  _searchKnown: function() {
    /*
     * searchKnown checks a local cache of words to see if we've seen a word that matches this string.
     * this allows us to not hit the server for words we've seen before.
     */
    return this._knownWords.filter(function(w) { return w.indexOf(this.state.value) >= 0; }.bind(this))[0];
  },
  _setGuess: function(word) {
    /*
     * _setGuess abstracts setting the current guess and calls the selection code.
     */
    this.setState({ guess: word }, this._setSelection);
  },
  _setSelection: function() {
    /*
     * _setSelection sets the selection of the guess text. This sets the highlighted area of the textarea.
     */
    this.refs.autocompleter.value = [this.state.beginning, this.state.guess].join(' ').trimLeft();
    var len = [this.state.beginning, this.state.value].join(' ').trim().length;
    this.refs.autocompleter.setSelectionRange(len, this.refs.autocompleter.value.length, 'backward');
  },
  _updateKnownWords: function(word) {
    /*
     * for now we are just adding the seen word to the cache and sorting based on length in ascending order.
     * This allows us to show the shortest, close match for this substring that we've seen before.
     */
    this._knownWords.push(word);
    this._knownWords.sort(function(a,b) { return a.length - b.length; });
  }
});

module.exports = AutoCompleter;
