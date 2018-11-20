## petconnect:  Find your perfect match!

This project was created as an example of a REACT app with multiple API integrations.
* The map data was imported using the GoogleMaps API.
* The pet and animal shelter data was imported using the PetFinder API.

### To get started, please complete the following steps:

 1. `git clone` or download the GitHub repo <a href='https://github.com/SallyMstar/goodneighbor.git'>goodneighbor (https://github.com/SallyMstar/goodneighbor.git)</a> 
 2. As noted below, enable CORS in your browser.  *You will get no data if you don't complete this step.*
 2. In a terminal window, navigate to the project directory on your computer.
 3. Type `npm start` to start the development server.  This may take a few moments to complete.
 4. Once the development server is running, navigate to `localhost:3000` in a browser window.


#### ** Please Note: The CORS browser plugin is required to view this app on a local server.
#### 		Follow the instructions below to enable the plugin for your browser:

* Firefox: <a href='https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/' target='blank'>CORS Everywhere – Get this Extension for  Firefox (en-US)</a>

* Chrome: <a href='https://chrome.google.com/webstore/detail/cors/dboaklophljenpcjkbbibpkbpbobnbld?hl=en' target='blank'>CORS - Chrome Web Store - Google Chrome</a>

* Safari: Later versions of Safari allow you to Disable Cross-Origin Restrictions. Just enable the developer menu from Preferences >> Advanced, and select "Disable Cross-Origin Restrictions" from the develop menu.

* Internet Explorer: To enable cross-origin access go to Tools->Internet Options->Security tab, click on “Custom Level” button. Find the Miscellaneous -> Access data sources across domains setting and select “Enable” option.


### Service Worker
*Although the serviceWorker is registered and activated, it will not work in development mode. To run the app in production mode, please complete the following steps:*

 1. From your project directory in a terminal window,
	* `npm run build`
	* `server -s build`
 2. In your browser with the CORS plugin as noted above,
 	* navigate to `localhost:5000`


#### Many thanks to the makers of Axios for the API integration options for REACT 


### ============= The following data was provided by Create React App =============

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

#### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
