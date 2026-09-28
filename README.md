# arcgis-calcite-template
Template for a ArcGIS JS 4 mapping web app using [calcite](https://developers.arcgis.com/calcite-design-system/) components

## Using the ArcGIS Maps SDK for Javascript
The components include the necessary Calcite stylesheets, if using Widgets (deprecated) you have to manually import the Calcite CSS files. 
```html
  <script type="module" src="https://js.arcgis.com/5.0/"></script>
```
Using $arcgis.import a typical import can be done as following
```js
const Portal = await $arcgis.import("@arcgis/core/portal/Portal.js")
```

## Dark og light mode
Wrap application in a div
```html
  <div class="calcite-theme-dark"></div>
```

In `src/styles/main.css` set the color scheme for dark themed browser controls e.g. scrollbars etc
```css
:root {
  color-scheme: dark; /* Dark style scrollbars etc.*/
}
```
## Debugging
For debugging, run the following command in the terminal:
```
http-server -S -C /Users/inge/Documents/dev/ssl/localhost.pem -K /Users/inge/Documents/dev/ssl/localhost-key.pem
```
