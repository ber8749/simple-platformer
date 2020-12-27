# earph-escape
A simple platforming game based on [Mozilla's HTML5 Games Workshop Platformer](https://mozdevs.github.io/html5-games-workshop/en/guides/platformer/start-here/) using [Phaser 3](https://phaser.io/phaser3).

## Install
1. Clone the repository
   ```
   $ git clone git@github.com:ber8749/earph-escape.git
   ```
1. Switch to repository directory
   ```
   $ cd earph-escape/
   ```
1. Install node dependencies
   ```
   $ npm install
   ```
1. Switch to required Node version:
   ```
   $ nvm use
   ```

## Play

1. Start the express server:
   ```
   $ node ./src/server.js
   ```
1. In a seperate terminal window, start the webpack server:
   ```
   $ npm run dev:start
   ```

## Build
1. Build the app distribution:
   ```
   $ npm run start
   ```
1. Start the HTTP server:
   ```
   $ cd dist/ && python -m SimpleHTTPServer
   ```
1. In a seperate terminal window, start the express server:
   ```
   $ node ./src/server.js
   ```
1. Open the following URL in your browser: http://localhost:8000/