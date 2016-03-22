var React = require('react');

var AutoCompleter = require('./AutoCompleter.js');

var App = React.createClass({


  render: function() {
    return (
      <div className='container'>
        <h1>
          Welcome to AutoCompleter
          <br />
          <small className='hidden-xs'>
            Autocompleter searches all the known words from&nbsp;
            <a href='https://en.wikipedia.org/wiki/The_Hitchhiker%27s_Guide_to_the_Galaxy'>The Hitchhikers Guide to the Galaxy</a>
            &nbsp;and allows you to autocomplete what you are typing.
          </small>
        </h1>
        <div className='well'>
          <label>Start typing to autocomplete your words:</label>
          <AutoCompleter
            placeholder='Enter some words here...'
           />
           <small className='pull-right'>(Hit Tab to complete)</small>
           <small className='text-muted'>Try words like: "hitchhiker", "strawberries", or "dramatic"</small>
        </div>
      </div>
    );
  }
});

module.exports = App;
