
# On a voyagé pour vous

This project is a part of Udacity's nanodegree program for The fornt end developper track. It's a web app in which you can plan trips, you will recive an image of your destination. This project uses [Geonames Api](http://www.geonames.org/export/web-services.html) to get the coordinates of the city by city name, [Weatherbit Api](https://www.weatherbit.io/) to get the weather forcast for the day of the trip and [Pixabay Api](https://pixabay.com/api/docs/) to get and image of the place. You need to create `.env` file that contains the apis keys. This app uses webpack, node and express as a local server and WorkboxPlugin to make the app available offline.

## Structure

The structure of the project is as below:
```
  - package.json
  - readme.md
  - webpack.dev.js
  - webpack.dev.js
  - src
    - server
      - app.js
      - app.spec.js
      - server.js
    - client folder
      - index.js
      -views
        - index.html
      - js
        - application.js 
        - service.js 
        - service.spec.js 
      - media
        -*.png
      - styles
        - _variables.scss 
        - main.scss 
        - popup.scss 
```

## Install

```
$ git clone https://github.com/Azazanafaa/on-a-voyage-pour-vous.git
$ cd on-a-voyage-pour-vous/
$ npm install
```
to run the server
```
$ npm run start
```
to run the app
```
$ npm run dev
```
or for production :
```
$ npm run build
```
## Contributing

Feel free to modify and add your own sections. I will be ***more than happy***.

## License

The content of this repository is licensed under a [The MIT License](https://opensource.org/licenses/MIT) .
