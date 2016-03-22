# b8ta Autocompleter

This is an auto completer that uses the b8ta api to fetch words from the hitchhikers guide to the galaxy.


## Getting Started

### Installing Python Dependencies:
We will be using Python 2.7 to launch a simple server for our application.
Install the dependencies with `pip install -r requirements.txt` This will install the `requests` package which is used to communicate with the b8ta api.

Verify the install by running: `python -c "import requests; print 'all good'"`

If "**all good**" shows up. You've got it!

### Installing Node Dependencies:
Install the node dependencies by running `npm install --dev` which will install the dependencies needed to transpile and build the frontend code.

### Running the Server:
Start the server by running `python simple_server.py`. You should see the server starting and running.

### Transpiling and Watching Frontend Code:
To start the frontend process, run the command: `grunt`. (If you see a message saying grunt is not installed, run `npm install -g grunt-cli`). This will build the javascript and start a watcher on the source directories waiting for changes.

### Open the application:
You can now navigate in a browser to: `http://localhost:8080/` to see the application. 