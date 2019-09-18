#!/bin/bash
# Builds the bundle.js that will be used in the deployed client
# Browsers don't have the require method defined, but Node.js does.
# Browserify reads the main.js file and all it's dependencies, among them the file state.js and all the Node modules and load them all in a unique file, bundle.js, which permits the use of the 'require' as you would use it in Node.
 
browserify ./src/main.js -o ./dist/bundle.js
