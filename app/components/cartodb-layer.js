import Ember from 'ember';
import CartoDbLayer from 'ember-leaflet-cartodb/components/cartodb-layer';

const { run, observer } = Ember;

export default CartoDbLayer.extend({
  leafletRequiredOptions: [
    'url'
  ],

  leafletOptions: [
    'zIndex', 'opacity'
  ],

  leafletEvents: [
  ],

  leafletProperties: [
    'url', 'zIndex', 'opacity', 'legends', 'infowindow'
  ],

  loading: false,

  didInsertParent() {
    alert("did insert parent");
    this._layer = this.createLayer();
    this._addObservers();
    this._addEventListeners();

    let map = this.get('containerLayer._layer');

    if (map) {
      let zIndex = this.get('options.zIndex');


      this._layer.on('done', (layer) => {
        // leaflet 1.0 hack, remove once cartodb.js supports leaflet 1.0
        layer._adjustTilePoint = () => {};

        cdb.geo.LeafletMapView.addLayerToMap(layer, map, zIndex);
        this.layer = layer;
        this.didCreateLayer();

        if (this.get('sql')) {
          this.setSql();
        }

        if (this.get('onClick')) {
          layer.getSubLayers().forEach((subLayer) => {

            cdb.vis.Vis.addCursorInteraction(map, subLayer);
            subLayer.setInteraction(true);
            subLayer.on('featureClick', run.bind(this, (...args) => {
              this.get('onClick')(...args);
            }));
          });
        }
      });
    }
  },

  setSql: observer('sql', function() {
    let SQL = this.get('sql');
    let index = this.get('layerIndex') || 0;

    if(typeof SQL === 'object') {
      SQL.forEach((el, index) => {
        this.layer.getSubLayer(index).setSQL(el);
      });

      this.layer.on('loading', () =>  {
        this.set('loading', true);
      });

      this.layer.on('load', () =>  {
        this.set('loading', false);
      });

    } else {
      this.layer.getSubLayer(index).setSQL(SQL);
    }
  }),

  willDestroyParent() {
    this.willDestroyLayer();
    this._removeEventListeners();
    this._removeObservers();

    let map = this.get('containerLayer._layer');

    if (map && this._layer && this.get('layer')) {
      map.removeLayer(this.get('layer'));
    }

    this._layer = null;
    this.layer = undefined;
  },

  createLayer() {
    let map = this.get('containerLayer._layer');
    let url = this.get('url');
    let options = this.getProperties('legends', 'infowindow');
    let layer = cartodb.createLayer(map, url, options);
    return layer;
  }
});
