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
        this.setupAdditionalSubLayers();

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

  setupAdditionalSubLayers() {
    let layer = this.layer; 

    // Client has asked for proposed routes toggle again. These should be in Carto, but we
    // need to ask Carto increase Builder/Editor map layer limit:

    layer.createSubLayer({
      sql: "SELECT * FROM bike_facilities WHERE fac_type=2 AND fac_stat IN (2,3)",
      cartocss: "\/** category visualization *\/\n\n#bike_facilities {\n   line-width: 2;\n   line-opacity: 0.7;\n}\n\n#bike_facilities[fac_type=1] {\n   line-color: #0874b9;\n}\n#bike_facilities[fac_type=2] {\n   line-color: #7f3193;\n}\n#bike_facilities[fac_type=9] {\n   line-color: #82C5EC;\n}\n\n#bike_facilities[fac_stat=2] {\n\tline-dasharray: 5, 5;\n}\n\n#bike_facilities[fac_stat=3] {\n\tline-dasharray: 5, 5;\n}"
    });

    layer.createSubLayer({
      sql: "SELECT * FROM bike_facilities WHERE fac_type=9 AND fac_stat IN (2,3)",
      cartocss: "\/** category visualization *\/\n\n#bike_facilities {\n   line-width: 2;\n   line-opacity: 0.7;\n}\n\n#bike_facilities[fac_type=1] {\n   line-color: #0874b9;\n}\n#bike_facilities[fac_type=2] {\n   line-color: #7f3193;\n}\n#bike_facilities[fac_type=9] {\n   line-color: #82C5EC;\n}\n\n#bike_facilities[fac_stat=2] {\n\tline-dasharray: 5, 5;\n}\n\n#bike_facilities[fac_stat=3] {\n\tline-dasharray: 5, 5;\n}"
    });

    layer.createSubLayer({
      sql: "SELECT * FROM bike_facilities WHERE fac_type=1 AND fac_stat IN (2,3)",
      cartocss: "\/** category visualization *\/\n\n#bike_facilities {\n   line-width: 2;\n   line-opacity: 0.7;\n}\n\n#bike_facilities[fac_type=1] {\n   line-color: #0874b9;\n}\n#bike_facilities[fac_type=2] {\n   line-color: #7f3193;\n}\n#bike_facilities[fac_type=9] {\n   line-color: #82C5EC;\n}\n\n#bike_facilities[fac_stat=2] {\n\tline-dasharray: 5, 5;\n}\n\n#bike_facilities[fac_stat=3] {\n\tline-dasharray: 5, 5;\n}"
    });

    layer.createSubLayer({
      sql: "SELECT * FROM walking_trails WHERE fac_stat IN (2,3)",
      cartocss: "\/** category visualization *\/\n\n#walking_trails {\n   line-width: 2;\n   line-opacity: 0.7;\n}\n\n#walking_trails[fac_type=1] {\n   line-color: #db813f;\n}\n#walking_trails[fac_type=2] {\n   line-color: #db813f;\n}\n#walking_trails[fac_type=3] {\n   line-color: #db813f;\n}\n\n#walking_trails[fac_stat=2] {\n\tline-dasharray: 5, 5;\n}\n\n#walking_trails[fac_stat=3] {\n\tline-dasharray: 5, 5;\n}"
    });

    layer.createSubLayer({
      sql: "SELECT * FROM bike_facilities WHERE fac_type=5 AND fac_stat IN (2,3)",
      cartocss: "\/** simple visualization *\/\n\n#bike_facilities{\n  line-color: #38A800;\n  line-width: 2;\n  line-opacity: 0.7;\n}\n\n#bike_facilities[fac_stat=2] {\n\tline-dasharray: 5, 5;\n}\n\n#bike_facilities[fac_stat=3] {\n\tline-dasharray: 5, 5;\n}\n\n#bike_facilities[surf_type=1] {\n  line-color: #a87000;\n}"
    });

    layer.createSubLayer({
      sql: "select * from landline_regional_greenways WHERE fac_stat IN (2,3)",
      cartocss: "\/** category visualization *\/\n\n#landline_regional_greenways {\n   line-width: 4;\n   line-opacity: 0.7;\n}\n\n#landline_regional_greenways[reg_ll_type=\"GR\"] {\n   line-color: #ffcc00;\n}\n#landline_regional_greenways[reg_ll_type=\"GR_WT\"] {\n   line-color: #d6a583;\n}\n#landline_regional_greenways[reg_ll_type=\"WT\"] {\n   line-color: #c696b7;\n}\n\n#landline_regional_greenways[fac_stat=2] {\n\tline-dasharray: 5, 5;\n}\n\n#landline_regional_greenways[fac_stat=3] {\n\tline-dasharray: 5, 5;\n}"
    });

  },

  createLayer() {
    let map = this.get('containerLayer._layer');
    let url = this.get('url');
    let options = this.getProperties('legends', 'infowindow');
    let layer = cartodb.createLayer(map, url, options);
    
    return layer;
  },

  bindSublayerStates: observer('sublayers,proposed', function() {
    let sublayers = this.get('sublayers');
    let proposed = this.get('proposed');
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
        if(proposed) {
          this.layer.getSubLayer(index+6).show();
        } else {
          this.layer.getSubLayer(index+6).hide();
        }
      } else {
        this.layer.getSubLayer(index).hide();
        this.layer.getSubLayer(index+6).hide();
      }
    });
  })
});
