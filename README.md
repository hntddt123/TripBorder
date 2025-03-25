# TripBorder Project
This is the project to help myself learning the app development processes

# Frontend setup
![image](/Images/TripBorderDev1.png)
![image](/Images/TripBorderDev2.png)

### Requirements

Create the following files
```.env.development``` 
```.env.production```
under TripBorderFrontend folder and include your 
VITE_MAPBOX_API_KEY=YOURKEY (https://docs.mapbox.com/help/glossary/access-token/)
VITE_FOURSQUARE_API_KEY=YOURKEY (https://docs.foursquare.com/developer/docs/manage-api-keys)

Private key and certificate for HTTPS development
```
./ssl/tripborderkey.pem
./ssl/tripbordercert.pem
```

Install node modules and run this project
```
cd TripBorderFrontend
npm i
```

## Available Scripts

In the project directory, you can run:

```npm run dev```  
Runs the app in the development mode with Vite

```npm run preview```  
Runs the app in the preview production mode with Vite

```npm run docker```  
Runs with docker, see Dockerfile and compose.dev.yml in the folder

```npm run dockerprod```  
Runs with docker, see Dockerfile and compose.prod.yml in the folder

```npm run test``` 
```npm run test:coverage```  
```npm run test:watch```  
Runs Jest testing suite with options 1 time, coverage report,  watch mode

```npm run lint:watch```  
Runs eslint

```npm run build```  
Builds the app for production to the `dist` folder.  
Bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  

## React Stuff
TripBorder Frontend project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


See [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

