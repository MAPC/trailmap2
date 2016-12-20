import Ember from 'ember';
import CartoDbLayer from 'ember-leaflet-cartodb/components/cartodb-layer';

export default CartoDbLayer.extend({
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
      });
    }
  },
  createLayer() {
    let map = this.get('containerLayer._layer');
    let requiredOptions = this.get('requiredOptions');
    let legends = this.getProperties('legends');
    
    let builtLayer = cartodb.createLayer(map, ...requiredOptions, legends);

    // builtLayer.addEventListener = L.Mixin.Events.addEventListener;
    return builtLayer;
  }
});
