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

  layerSetup() {
    this._layer = this.createLayer();

    this._addObservers();
    this._addEventListeners();
    if (this.get('containerLayer')) {
      let map = this.get('containerLayer')._layer;
      let zIndex = this.get('options.zIndex');
      this._layer.on('done', (layer) => {
        cdb.geo.LeafletMapView.addLayerToMap(layer, map, zIndex);

        Ember.set(map, 'vizJson', Ember.get(layer, 'options.options.layer_definition.layers'));
        this.layer = layer;
        this.didCreateLayer();
        if(this.get('sql')) {
          this.setSql();
        }
        if(this.get('sublayers')) {
          this.bindSublayerStates();
        }
      });
    }
  },

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
  },

  bindSublayerStates: observer('sublayers', function() {
    let sublayers = this.get('sublayers');
    let values = Object.values(sublayers);

    this.layer.on('loading', () =>  {
      this.set('loading', true);
    });

    this.layer.on('load', () =>  {
      this.set('loading', false);
    });

    values.forEach((property, index) => {

      let sublayer = this.layer.getSubLayer(index);

      if(property) {
        this.layer.getSubLayer(index).show();
      } else {
        this.layer.getSubLayer(index).hide();
      }
    });
  })
});
