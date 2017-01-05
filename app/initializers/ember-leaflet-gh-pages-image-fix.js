import ENV from '../config/environment';
/* global L */

export function initialize(/* container, application */) {
  L.Icon.Default.imagePath =  `${ENV.prepend || '/'}assets/images`;
}

export default {
  name: 'leaflet-assets-cdn',
  initialize: initialize,
  after: 'leaflet-assets'
};