"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('trailmap/app', ['exports', 'ember', 'trailmap/resolver', 'ember-load-initializers', 'trailmap/config/environment'], function (exports, _ember, _trailmapResolver, _emberLoadInitializers, _trailmapConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _trailmapConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _trailmapConfigEnvironment['default'].podModulePrefix,
    Resolver: _trailmapResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _trailmapConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('trailmap/breakpoints', ['exports'], function (exports) {
  exports['default'] = {
    mobile: '(max-width: 415px)',
    tablet: '(min-width: 416px) and (max-width: 991px)',
    desktop: '(min-width: 992px) and (max-width: 1200px)'
  };
});
define("trailmap/components/-lf-get-outlet-state", ["exports", "liquid-fire/components/-lf-get-outlet-state"], function (exports, _liquidFireComponentsLfGetOutletState) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLfGetOutletState["default"];
    }
  });
});
define('trailmap/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'trailmap/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _trailmapConfigEnvironment) {

  var name = _trailmapConfigEnvironment['default'].APP.name;
  var version = _trailmapConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('trailmap/components/array-path-layer', ['exports', 'ember-leaflet/components/array-path-layer'], function (exports, _emberLeafletComponentsArrayPathLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsArrayPathLayer['default'];
    }
  });
});
define('trailmap/components/base-layer', ['exports', 'ember-leaflet/components/base-layer'], function (exports, _emberLeafletComponentsBaseLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsBaseLayer['default'];
    }
  });
});
define('trailmap/components/cartodb-layer', ['exports', 'ember', 'ember-leaflet-cartodb/components/cartodb-layer'], function (exports, _ember, _emberLeafletCartodbComponentsCartodbLayer) {
  var run = _ember['default'].run;
  var observer = _ember['default'].observer;
  exports['default'] = _emberLeafletCartodbComponentsCartodbLayer['default'].extend({
    leafletRequiredOptions: ['url'],

    leafletOptions: ['zIndex', 'opacity'],

    leafletEvents: [],

    leafletProperties: ['url', 'zIndex', 'opacity', 'legends', 'infowindow'],

    loading: false,

    layerSetup: function layerSetup() {
      var _this = this;

      this._layer = this.createLayer();

      this._addObservers();
      this._addEventListeners();
      if (this.get('containerLayer')) {
        (function () {
          var map = _this.get('containerLayer')._layer;
          var zIndex = _this.get('options.zIndex');
          _this._layer.on('done', function (layer) {
            cdb.geo.LeafletMapView.addLayerToMap(layer, map, zIndex);

            _ember['default'].set(map, 'vizJson', _ember['default'].get(layer, 'options.options.layer_definition.layers'));
            _this.layer = layer;

            _this.didCreateLayer();
            _this.setupAdditionalSubLayers();

            if (_this.get('sql')) {
              _this.setSql();
            }
            if (_this.get('sublayers')) {
              _this.bindSublayerStates();
            }
          });
        })();
      }
    },

    willDestroyParent: function willDestroyParent() {
      this.willDestroyLayer();
      this._removeEventListeners();
      this._removeObservers();

      var map = this.get('containerLayer._layer');

      if (map && this._layer && this.get('layer')) {
        map.removeLayer(this.get('layer'));
      }

      this._layer = null;
      this.layer = undefined;
    },

    setupAdditionalSubLayers: function setupAdditionalSubLayers() {
      var layer = this.layer;

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

    createLayer: function createLayer() {
      var map = this.get('containerLayer._layer');
      var url = this.get('url');
      var options = this.getProperties('legends', 'infowindow');
      var layer = cartodb.createLayer(map, url, options);

      return layer;
    },

    bindSublayerStates: observer('sublayers,proposed', function () {
      var _this2 = this;

      var sublayers = this.get('sublayers');
      var proposed = this.get('proposed');
      var values = Object.values(sublayers);

      this.layer.on('loading', function () {
        _this2.set('loading', true);
      });

      this.layer.on('load', function () {
        _this2.set('loading', false);
      });

      values.forEach(function (property, index) {

        var sublayer = _this2.layer.getSubLayer(index);

        if (property) {
          _this2.layer.getSubLayer(index).show();
          if (proposed) {
            _this2.layer.getSubLayer(index + 6).show();
          } else {
            _this2.layer.getSubLayer(index + 6).hide();
          }
        } else {
          _this2.layer.getSubLayer(index).hide();
          _this2.layer.getSubLayer(index + 6).hide();
        }
      });
    })
  });
});
define('trailmap/components/circle-layer', ['exports', 'ember-leaflet/components/circle-layer'], function (exports, _emberLeafletComponentsCircleLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsCircleLayer['default'];
    }
  });
});
define('trailmap/components/circle-marker-layer', ['exports', 'ember-leaflet/components/circle-marker-layer'], function (exports, _emberLeafletComponentsCircleMarkerLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsCircleMarkerLayer['default'];
    }
  });
});
define('trailmap/components/container-layer', ['exports', 'ember-leaflet/components/container-layer'], function (exports, _emberLeafletComponentsContainerLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsContainerLayer['default'];
    }
  });
});
define('trailmap/components/div-overlay-layer', ['exports', 'ember-leaflet/components/div-overlay-layer'], function (exports, _emberLeafletComponentsDivOverlayLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsDivOverlayLayer['default'];
    }
  });
});
define('trailmap/components/ember-tether', ['exports', 'ember-tether/components/ember-tether'], function (exports, _emberTetherComponentsEmberTether) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberTetherComponentsEmberTether['default'];
    }
  });
});
define('trailmap/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, _emberWormholeComponentsEmberWormhole) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWormholeComponentsEmberWormhole['default'];
    }
  });
});
define('trailmap/components/geojson-layer', ['exports', 'ember-leaflet/components/geojson-layer'], function (exports, _emberLeafletComponentsGeojsonLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsGeojsonLayer['default'];
    }
  });
});
define("trailmap/components/illiquid-model", ["exports", "liquid-fire/components/illiquid-model"], function (exports, _liquidFireComponentsIlliquidModel) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsIlliquidModel["default"];
    }
  });
});
define('trailmap/components/image-layer', ['exports', 'ember-leaflet/components/image-layer'], function (exports, _emberLeafletComponentsImageLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsImageLayer['default'];
    }
  });
});
define('trailmap/components/leaflet-map', ['exports', 'ember', 'ember-leaflet/components/leaflet-map'], function (exports, _ember, _emberLeafletComponentsLeafletMap) {
  exports['default'] = _emberLeafletComponentsLeafletMap['default'].extend({});
});
define("trailmap/components/liquid-bind", ["exports", "liquid-fire/components/liquid-bind"], function (exports, _liquidFireComponentsLiquidBind) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidBind["default"];
    }
  });
});
define("trailmap/components/liquid-child", ["exports", "liquid-fire/components/liquid-child"], function (exports, _liquidFireComponentsLiquidChild) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidChild["default"];
    }
  });
});
define("trailmap/components/liquid-container", ["exports", "liquid-fire/components/liquid-container"], function (exports, _liquidFireComponentsLiquidContainer) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidContainer["default"];
    }
  });
});
define("trailmap/components/liquid-if", ["exports", "liquid-fire/components/liquid-if"], function (exports, _liquidFireComponentsLiquidIf) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidIf["default"];
    }
  });
});
define("trailmap/components/liquid-measured", ["exports", "liquid-fire/components/liquid-measured"], function (exports, _liquidFireComponentsLiquidMeasured) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidMeasured["default"];
    }
  });
  Object.defineProperty(exports, "measure", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidMeasured.measure;
    }
  });
});
define("trailmap/components/liquid-outlet", ["exports", "liquid-fire/components/liquid-outlet"], function (exports, _liquidFireComponentsLiquidOutlet) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidOutlet["default"];
    }
  });
});
define("trailmap/components/liquid-spacer", ["exports", "liquid-fire/components/liquid-spacer"], function (exports, _liquidFireComponentsLiquidSpacer) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidSpacer["default"];
    }
  });
});
define('trailmap/components/liquid-sync', ['exports', 'liquid-fire/components/liquid-sync'], function (exports, _liquidFireComponentsLiquidSync) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidSync['default'];
    }
  });
});
define("trailmap/components/liquid-unless", ["exports", "liquid-fire/components/liquid-unless"], function (exports, _liquidFireComponentsLiquidUnless) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidUnless["default"];
    }
  });
});
define("trailmap/components/liquid-versions", ["exports", "liquid-fire/components/liquid-versions"], function (exports, _liquidFireComponentsLiquidVersions) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidVersions["default"];
    }
  });
});
define('trailmap/components/marker-layer', ['exports', 'ember-leaflet/components/marker-layer'], function (exports, _emberLeafletComponentsMarkerLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsMarkerLayer['default'];
    }
  });
});
define('trailmap/components/path-layer', ['exports', 'ember-leaflet/components/path-layer'], function (exports, _emberLeafletComponentsPathLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsPathLayer['default'];
    }
  });
});
define('trailmap/components/point-path-layer', ['exports', 'ember-leaflet/components/point-path-layer'], function (exports, _emberLeafletComponentsPointPathLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsPointPathLayer['default'];
    }
  });
});
define('trailmap/components/polygon-layer', ['exports', 'ember-leaflet/components/polygon-layer'], function (exports, _emberLeafletComponentsPolygonLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsPolygonLayer['default'];
    }
  });
});
define('trailmap/components/polyline-layer', ['exports', 'ember-leaflet/components/polyline-layer'], function (exports, _emberLeafletComponentsPolylineLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsPolylineLayer['default'];
    }
  });
});
define('trailmap/components/popup-layer', ['exports', 'ember-leaflet/components/popup-layer'], function (exports, _emberLeafletComponentsPopupLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsPopupLayer['default'];
    }
  });
});
define('trailmap/components/scoped-array-checklist', ['exports', 'ember', 'ember-computed'], function (exports, _ember, _emberComputed) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['filter-list', 'menu'],
    checklistItems: null,
    valuesList: '',

    init: function init() {
      this._super.apply(this, arguments);
      this.checklistItems = this.checklistItems || [];
    },

    parsedValuesList: (0, _emberComputed['default'])('valuesList', function () {
      var valuesList = this.get('valuesList');
      return JSON.parse('[' + valuesList + ']');
    }),

    actions: {
      toggleItem: function toggleItem(item, value) {
        var newList = this.get('parsedValuesList');
        value ? newList.pushObject(item.value) : newList.removeObject(item.value);

        this.set('valuesList', newList.toString());
      }
    }
  });
});
define('trailmap/components/splash-intro', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['splash-intro'],
    didInsertElement: function didInsertElement() {
      $('.logo').transition('fade down', { duration: 1750 });
      $('p').transition('fade down', { duration: 1750 });
      // $('.option')
      //   .transition('fade down', { duration: 1750 })
      // ;
    }
  });
});
define('trailmap/components/tile-layer', ['exports', 'ember-leaflet/components/tile-layer'], function (exports, _emberLeafletComponentsTileLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsTileLayer['default'];
    }
  });
});
define('trailmap/components/tooltip-layer', ['exports', 'ember-leaflet/components/tooltip-layer'], function (exports, _emberLeafletComponentsTooltipLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsTooltipLayer['default'];
    }
  });
});
define('trailmap/components/ui-accordion', ['exports', 'ember'], function (exports, _ember) {
  // import Accordion from 'semantic-ui-ember/components/ui-accordion';

  exports['default'] = _ember['default'].Component.extend({
    didInsertElement: function didInsertElement() {
      $('.ui.accordion').accordion();
      $('.ui.accordion .parent-checkbox').click(function (e) {
        e.stopPropagation();
      });
    }
  });
});
define('trailmap/components/ui-checkbox', ['exports', 'ember', 'semantic-ui-ember/components/ui-checkbox'], function (exports, _ember, _semanticUiEmberComponentsUiCheckbox) {
  exports['default'] = _semanticUiEmberComponentsUiCheckbox['default'].extend({});
});
define('trailmap/components/ui-dimmer', ['exports', 'semantic-ui-ember/components/ui-dimmer'], function (exports, _semanticUiEmberComponentsUiDimmer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiDimmer['default'];
    }
  });
});
define('trailmap/components/ui-dropdown', ['exports', 'semantic-ui-ember/components/ui-dropdown'], function (exports, _semanticUiEmberComponentsUiDropdown) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiDropdown['default'];
    }
  });
});
define('trailmap/components/ui-embed', ['exports', 'semantic-ui-ember/components/ui-embed'], function (exports, _semanticUiEmberComponentsUiEmbed) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiEmbed['default'];
    }
  });
});
define('trailmap/components/ui-modal', ['exports', 'semantic-ui-ember/components/ui-modal'], function (exports, _semanticUiEmberComponentsUiModal) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiModal['default'];
    }
  });
});
define('trailmap/components/ui-nag', ['exports', 'semantic-ui-ember/components/ui-nag'], function (exports, _semanticUiEmberComponentsUiNag) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiNag['default'];
    }
  });
});
define('trailmap/components/ui-popup', ['exports', 'semantic-ui-ember/components/ui-popup'], function (exports, _semanticUiEmberComponentsUiPopup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiPopup['default'];
    }
  });
});
define('trailmap/components/ui-progress', ['exports', 'semantic-ui-ember/components/ui-progress'], function (exports, _semanticUiEmberComponentsUiProgress) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiProgress['default'];
    }
  });
});
define('trailmap/components/ui-radio', ['exports', 'semantic-ui-ember/components/ui-radio'], function (exports, _semanticUiEmberComponentsUiRadio) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiRadio['default'];
    }
  });
});
define('trailmap/components/ui-rating', ['exports', 'semantic-ui-ember/components/ui-rating'], function (exports, _semanticUiEmberComponentsUiRating) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiRating['default'];
    }
  });
});
define('trailmap/components/ui-search', ['exports', 'semantic-ui-ember/components/ui-search'], function (exports, _semanticUiEmberComponentsUiSearch) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiSearch['default'];
    }
  });
});
define('trailmap/components/ui-shape', ['exports', 'semantic-ui-ember/components/ui-shape'], function (exports, _semanticUiEmberComponentsUiShape) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiShape['default'];
    }
  });
});
define('trailmap/components/ui-sidebar', ['exports', 'semantic-ui-ember/components/ui-sidebar'], function (exports, _semanticUiEmberComponentsUiSidebar) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiSidebar['default'];
    }
  });
});
define('trailmap/components/ui-sticky', ['exports', 'semantic-ui-ember/components/ui-sticky'], function (exports, _semanticUiEmberComponentsUiSticky) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberComponentsUiSticky['default'];
    }
  });
});
define('trailmap/components/wms-tile-layer', ['exports', 'ember-leaflet/components/wms-tile-layer'], function (exports, _emberLeafletComponentsWmsTileLayer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletComponentsWmsTileLayer['default'];
    }
  });
});
define('trailmap/controllers/application', ['exports', 'ember', 'ember-computed'], function (exports, _ember, _emberComputed) {
  exports['default'] = _ember['default'].Controller.extend({
    queryParams: ['protected', 'shared', 'bike_lane', 'walk', 'multi_use_path', 'landline'],

    'protected': true,
    shared: true,
    bike_lane: true,
    walk: true,
    multi_use_path: true,
    landline: false,
    proposed: false,
    sublayers: (function () {
      // order matters.
      return this.getProperties('protected', 'shared', 'bike_lane', 'walk', 'multi_use_path', 'landline');
    }).property('protected,shared,bike_lane,walk,multi_use_path,landline'),

    basemap: 'default',

    zoom: 11,
    lat: 42.32657,
    lng: -71.352,

    geolocation: _ember['default'].inject.service(),
    currentLocation: null,
    customIcon: _ember['default'].computed(function () {
      return L.icon.pulse({ iconSize: [20, 20], color: 'blue' });
    }),

    actions: {
      toggleAll: function toggleAll(props) {
        var _this = this;

        var properties = this.getProperties(props);
        var values = Object.values(properties);
        var keys = Object.keys(properties);
        if (values.includes(true)) {
          keys.forEach(function (key) {
            _this.set(key, false);
          });
        } else {
          keys.forEach(function (key) {
            _this.set(key, true);
          });
        }
      },

      updatePosition: function updatePosition(e) {
        var map = e.target;
        this.setProperties({
          lat: map.getCenter().lat,
          lng: map.getCenter().lng,
          zoom: map.getZoom()
        });
      },

      trackLocation: function trackLocation() {
        var _this2 = this;

        this.get('geolocation').trackLocation({ enableHighAccuracy: true }, function (geoObject) {
          _this2.set('currentLocation', _this2.get('geolocation.currentLocation'));
        });
        this.get('geolocation').getLocation().then(function (geoObject) {
          var _geoObject$coords = geoObject.coords;
          var latitude = _geoObject$coords.latitude;
          var longitude = _geoObject$coords.longitude;

          _this2.setProperties({ lat: latitude, lng: longitude, zoom: 18 });
        });

        this.transitionToRoute('filters', { queryParams: { bike_lane: false,
            'protected': false,
            shared: false,
            walk: true,
            multi_use_path: false,
            landline: false } });
      }
    }
  });
});
define('trailmap/controllers/filters', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    applicationController: _ember['default'].inject.controller('application'),
    actions: {
      toggleAll: function toggleAll(props) {
        var applicationController = this.get('applicationController');
        var properties = applicationController.getProperties(props);
        var values = Object.values(properties);
        var keys = Object.keys(properties);
        if (values.includes(true)) {
          keys.forEach(function (key) {
            applicationController.set(key, false);
          });
        } else {
          keys.forEach(function (key) {
            applicationController.set(key, true);
          });
        }
      }
    }
  });
});
define('trailmap/controllers/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    applicationController: _ember['default'].inject.controller('application')
  });
});
define('trailmap/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/append', ['exports', 'ember-composable-helpers/helpers/append'], function (exports, _emberComposableHelpersHelpersAppend) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend['default'];
    }
  });
  Object.defineProperty(exports, 'append', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend.append;
    }
  });
});
define('trailmap/helpers/array', ['exports', 'ember-composable-helpers/helpers/array'], function (exports, _emberComposableHelpersHelpersArray) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersArray['default'];
    }
  });
  Object.defineProperty(exports, 'array', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersArray.array;
    }
  });
});
define('trailmap/helpers/camelize', ['exports', 'ember-composable-helpers/helpers/camelize'], function (exports, _emberComposableHelpersHelpersCamelize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCamelize['default'];
    }
  });
  Object.defineProperty(exports, 'camelize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCamelize.camelize;
    }
  });
});
define('trailmap/helpers/capitalize', ['exports', 'ember-composable-helpers/helpers/capitalize'], function (exports, _emberComposableHelpersHelpersCapitalize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCapitalize['default'];
    }
  });
  Object.defineProperty(exports, 'capitalize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCapitalize.capitalize;
    }
  });
});
define('trailmap/helpers/chunk', ['exports', 'ember-composable-helpers/helpers/chunk'], function (exports, _emberComposableHelpersHelpersChunk) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk['default'];
    }
  });
  Object.defineProperty(exports, 'chunk', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk.chunk;
    }
  });
});
define('trailmap/helpers/classify', ['exports', 'ember-composable-helpers/helpers/classify'], function (exports, _emberComposableHelpersHelpersClassify) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersClassify['default'];
    }
  });
  Object.defineProperty(exports, 'classify', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersClassify.classify;
    }
  });
});
define('trailmap/helpers/compact', ['exports', 'ember-composable-helpers/helpers/compact'], function (exports, _emberComposableHelpersHelpersCompact) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact['default'];
    }
  });
  Object.defineProperty(exports, 'compact', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact.compact;
    }
  });
});
define('trailmap/helpers/compute', ['exports', 'ember-composable-helpers/helpers/compute'], function (exports, _emberComposableHelpersHelpersCompute) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute['default'];
    }
  });
  Object.defineProperty(exports, 'compute', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute.compute;
    }
  });
});
define('trailmap/helpers/contains', ['exports', 'ember-composable-helpers/helpers/contains'], function (exports, _emberComposableHelpersHelpersContains) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains['default'];
    }
  });
  Object.defineProperty(exports, 'contains', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains.contains;
    }
  });
});
define('trailmap/helpers/dasherize', ['exports', 'ember-composable-helpers/helpers/dasherize'], function (exports, _emberComposableHelpersHelpersDasherize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDasherize['default'];
    }
  });
  Object.defineProperty(exports, 'dasherize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDasherize.dasherize;
    }
  });
});
define('trailmap/helpers/dec', ['exports', 'ember-composable-helpers/helpers/dec'], function (exports, _emberComposableHelpersHelpersDec) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec['default'];
    }
  });
  Object.defineProperty(exports, 'dec', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec.dec;
    }
  });
});
define('trailmap/helpers/div-icon', ['exports', 'ember-leaflet/helpers/div-icon'], function (exports, _emberLeafletHelpersDivIcon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletHelpersDivIcon['default'];
    }
  });
  Object.defineProperty(exports, 'divIcon', {
    enumerable: true,
    get: function get() {
      return _emberLeafletHelpersDivIcon.divIcon;
    }
  });
});
define('trailmap/helpers/drop', ['exports', 'ember-composable-helpers/helpers/drop'], function (exports, _emberComposableHelpersHelpersDrop) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop['default'];
    }
  });
  Object.defineProperty(exports, 'drop', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop.drop;
    }
  });
});
define('trailmap/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/filter-by', ['exports', 'ember-composable-helpers/helpers/filter-by'], function (exports, _emberComposableHelpersHelpersFilterBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy['default'];
    }
  });
  Object.defineProperty(exports, 'filterBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy.filterBy;
    }
  });
});
define('trailmap/helpers/filter', ['exports', 'ember-composable-helpers/helpers/filter'], function (exports, _emberComposableHelpersHelpersFilter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter['default'];
    }
  });
  Object.defineProperty(exports, 'filter', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter.filter;
    }
  });
});
define('trailmap/helpers/find-by', ['exports', 'ember-composable-helpers/helpers/find-by'], function (exports, _emberComposableHelpersHelpersFindBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy['default'];
    }
  });
  Object.defineProperty(exports, 'findBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy.findBy;
    }
  });
});
define('trailmap/helpers/flatten', ['exports', 'ember-composable-helpers/helpers/flatten'], function (exports, _emberComposableHelpersHelpersFlatten) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten['default'];
    }
  });
  Object.defineProperty(exports, 'flatten', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten.flatten;
    }
  });
});
define('trailmap/helpers/group-by', ['exports', 'ember-composable-helpers/helpers/group-by'], function (exports, _emberComposableHelpersHelpersGroupBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersGroupBy['default'];
    }
  });
  Object.defineProperty(exports, 'groupBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersGroupBy.groupBy;
    }
  });
});
define('trailmap/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/has-next', ['exports', 'ember-composable-helpers/helpers/has-next'], function (exports, _emberComposableHelpersHelpersHasNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext['default'];
    }
  });
  Object.defineProperty(exports, 'hasNext', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext.hasNext;
    }
  });
});
define('trailmap/helpers/has-previous', ['exports', 'ember-composable-helpers/helpers/has-previous'], function (exports, _emberComposableHelpersHelpersHasPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'hasPrevious', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious.hasPrevious;
    }
  });
});
define('trailmap/helpers/html-safe', ['exports', 'ember-composable-helpers/helpers/html-safe'], function (exports, _emberComposableHelpersHelpersHtmlSafe) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHtmlSafe['default'];
    }
  });
  Object.defineProperty(exports, 'htmlSafe', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHtmlSafe.htmlSafe;
    }
  });
});
define('trailmap/helpers/icon', ['exports', 'ember-leaflet/helpers/icon'], function (exports, _emberLeafletHelpersIcon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletHelpersIcon['default'];
    }
  });
  Object.defineProperty(exports, 'icon', {
    enumerable: true,
    get: function get() {
      return _emberLeafletHelpersIcon.icon;
    }
  });
});
define('trailmap/helpers/inc', ['exports', 'ember-composable-helpers/helpers/inc'], function (exports, _emberComposableHelpersHelpersInc) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc['default'];
    }
  });
  Object.defineProperty(exports, 'inc', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc.inc;
    }
  });
});
define('trailmap/helpers/intersect', ['exports', 'ember-composable-helpers/helpers/intersect'], function (exports, _emberComposableHelpersHelpersIntersect) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect['default'];
    }
  });
  Object.defineProperty(exports, 'intersect', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect.intersect;
    }
  });
});
define('trailmap/helpers/invoke', ['exports', 'ember-composable-helpers/helpers/invoke'], function (exports, _emberComposableHelpersHelpersInvoke) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke['default'];
    }
  });
  Object.defineProperty(exports, 'invoke', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke.invoke;
    }
  });
});
define('trailmap/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/is-equal', ['exports', 'ember-truth-helpers/helpers/is-equal'], function (exports, _emberTruthHelpersHelpersIsEqual) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberTruthHelpersHelpersIsEqual['default'];
    }
  });
  Object.defineProperty(exports, 'isEqual', {
    enumerable: true,
    get: function get() {
      return _emberTruthHelpersHelpersIsEqual.isEqual;
    }
  });
});
define('trailmap/helpers/join', ['exports', 'ember-composable-helpers/helpers/join'], function (exports, _emberComposableHelpersHelpersJoin) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin['default'];
    }
  });
  Object.defineProperty(exports, 'join', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin.join;
    }
  });
});
define('trailmap/helpers/lat-lng-bounds', ['exports', 'ember-leaflet/helpers/lat-lng-bounds'], function (exports, _emberLeafletHelpersLatLngBounds) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletHelpersLatLngBounds['default'];
    }
  });
  Object.defineProperty(exports, 'latLngBounds', {
    enumerable: true,
    get: function get() {
      return _emberLeafletHelpersLatLngBounds.latLngBounds;
    }
  });
});
define('trailmap/helpers/lf-lock-model', ['exports', 'liquid-fire/helpers/lf-lock-model'], function (exports, _liquidFireHelpersLfLockModel) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireHelpersLfLockModel['default'];
    }
  });
  Object.defineProperty(exports, 'lfLockModel', {
    enumerable: true,
    get: function get() {
      return _liquidFireHelpersLfLockModel.lfLockModel;
    }
  });
});
define('trailmap/helpers/lf-or', ['exports', 'liquid-fire/helpers/lf-or'], function (exports, _liquidFireHelpersLfOr) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireHelpersLfOr['default'];
    }
  });
  Object.defineProperty(exports, 'lfOr', {
    enumerable: true,
    get: function get() {
      return _liquidFireHelpersLfOr.lfOr;
    }
  });
});
define('trailmap/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/map-by', ['exports', 'ember-composable-helpers/helpers/map-by'], function (exports, _emberComposableHelpersHelpersMapBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy['default'];
    }
  });
  Object.defineProperty(exports, 'mapBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy.mapBy;
    }
  });
});
define('trailmap/helpers/map-value', ['exports', 'semantic-ui-ember/helpers/map-value'], function (exports, _semanticUiEmberHelpersMapValue) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberHelpersMapValue['default'];
    }
  });
  Object.defineProperty(exports, 'mapValue', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberHelpersMapValue.mapValue;
    }
  });
});
define('trailmap/helpers/map', ['exports', 'ember-composable-helpers/helpers/map'], function (exports, _emberComposableHelpersHelpersMap) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap['default'];
    }
  });
  Object.defineProperty(exports, 'map', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap.map;
    }
  });
});
define('trailmap/helpers/next', ['exports', 'ember-composable-helpers/helpers/next'], function (exports, _emberComposableHelpersHelpersNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext['default'];
    }
  });
  Object.defineProperty(exports, 'next', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext.next;
    }
  });
});
define('trailmap/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/object-at', ['exports', 'ember-composable-helpers/helpers/object-at'], function (exports, _emberComposableHelpersHelpersObjectAt) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt['default'];
    }
  });
  Object.defineProperty(exports, 'objectAt', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt.objectAt;
    }
  });
});
define('trailmap/helpers/optional', ['exports', 'ember-composable-helpers/helpers/optional'], function (exports, _emberComposableHelpersHelpersOptional) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional['default'];
    }
  });
  Object.defineProperty(exports, 'optional', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional.optional;
    }
  });
});
define('trailmap/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/helpers/order-delimited-string', ['exports', 'ember'], function (exports, _ember) {
  exports.orderDelimitedString = orderDelimitedString;

  function orderDelimitedString(context, options) {
    if (context) {
      var tempArr = context[0].trim().split(options["delimiter"]).sortBy('');

      return tempArr;
    }
  }

  exports['default'] = _ember['default'].Helper.helper(orderDelimitedString);
});
define('trailmap/helpers/pipe-action', ['exports', 'ember-composable-helpers/helpers/pipe-action'], function (exports, _emberComposableHelpersHelpersPipeAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipeAction['default'];
    }
  });
});
define('trailmap/helpers/pipe', ['exports', 'ember-composable-helpers/helpers/pipe'], function (exports, _emberComposableHelpersHelpersPipe) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe['default'];
    }
  });
  Object.defineProperty(exports, 'pipe', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe.pipe;
    }
  });
});
define('trailmap/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('trailmap/helpers/point', ['exports', 'ember-leaflet/helpers/point'], function (exports, _emberLeafletHelpersPoint) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletHelpersPoint['default'];
    }
  });
  Object.defineProperty(exports, 'point', {
    enumerable: true,
    get: function get() {
      return _emberLeafletHelpersPoint.point;
    }
  });
});
define('trailmap/helpers/previous', ['exports', 'ember-composable-helpers/helpers/previous'], function (exports, _emberComposableHelpersHelpersPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'previous', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious.previous;
    }
  });
});
define('trailmap/helpers/queue', ['exports', 'ember-composable-helpers/helpers/queue'], function (exports, _emberComposableHelpersHelpersQueue) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue['default'];
    }
  });
  Object.defineProperty(exports, 'queue', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue.queue;
    }
  });
});
define('trailmap/helpers/range', ['exports', 'ember-composable-helpers/helpers/range'], function (exports, _emberComposableHelpersHelpersRange) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange['default'];
    }
  });
  Object.defineProperty(exports, 'range', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange.range;
    }
  });
});
define('trailmap/helpers/reduce', ['exports', 'ember-composable-helpers/helpers/reduce'], function (exports, _emberComposableHelpersHelpersReduce) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce['default'];
    }
  });
  Object.defineProperty(exports, 'reduce', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce.reduce;
    }
  });
});
define('trailmap/helpers/reject-by', ['exports', 'ember-composable-helpers/helpers/reject-by'], function (exports, _emberComposableHelpersHelpersRejectBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy['default'];
    }
  });
  Object.defineProperty(exports, 'rejectBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy.rejectBy;
    }
  });
});
define('trailmap/helpers/repeat', ['exports', 'ember-composable-helpers/helpers/repeat'], function (exports, _emberComposableHelpersHelpersRepeat) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat['default'];
    }
  });
  Object.defineProperty(exports, 'repeat', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat.repeat;
    }
  });
});
define('trailmap/helpers/reverse', ['exports', 'ember-composable-helpers/helpers/reverse'], function (exports, _emberComposableHelpersHelpersReverse) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse['default'];
    }
  });
  Object.defineProperty(exports, 'reverse', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse.reverse;
    }
  });
});
define('trailmap/helpers/route-action', ['exports', 'ember-route-action-helper/helpers/route-action'], function (exports, _emberRouteActionHelperHelpersRouteAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberRouteActionHelperHelpersRouteAction['default'];
    }
  });
});
define('trailmap/helpers/shuffle', ['exports', 'ember-composable-helpers/helpers/shuffle'], function (exports, _emberComposableHelpersHelpersShuffle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle['default'];
    }
  });
  Object.defineProperty(exports, 'shuffle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle.shuffle;
    }
  });
});
define('trailmap/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('trailmap/helpers/slice', ['exports', 'ember-composable-helpers/helpers/slice'], function (exports, _emberComposableHelpersHelpersSlice) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice['default'];
    }
  });
  Object.defineProperty(exports, 'slice', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice.slice;
    }
  });
});
define('trailmap/helpers/sort-by', ['exports', 'ember-composable-helpers/helpers/sort-by'], function (exports, _emberComposableHelpersHelpersSortBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy['default'];
    }
  });
  Object.defineProperty(exports, 'sortBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy.sortBy;
    }
  });
});
define('trailmap/helpers/take', ['exports', 'ember-composable-helpers/helpers/take'], function (exports, _emberComposableHelpersHelpersTake) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake['default'];
    }
  });
  Object.defineProperty(exports, 'take', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake.take;
    }
  });
});
define('trailmap/helpers/titleize', ['exports', 'ember-composable-helpers/helpers/titleize'], function (exports, _emberComposableHelpersHelpersTitleize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTitleize['default'];
    }
  });
  Object.defineProperty(exports, 'titleize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTitleize.titleize;
    }
  });
});
define('trailmap/helpers/toggle-action', ['exports', 'ember-composable-helpers/helpers/toggle-action'], function (exports, _emberComposableHelpersHelpersToggleAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggleAction['default'];
    }
  });
});
define('trailmap/helpers/toggle', ['exports', 'ember-composable-helpers/helpers/toggle'], function (exports, _emberComposableHelpersHelpersToggle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle['default'];
    }
  });
  Object.defineProperty(exports, 'toggle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle.toggle;
    }
  });
});
define('trailmap/helpers/truncate', ['exports', 'ember-composable-helpers/helpers/truncate'], function (exports, _emberComposableHelpersHelpersTruncate) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTruncate['default'];
    }
  });
  Object.defineProperty(exports, 'truncate', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTruncate.truncate;
    }
  });
});
define('trailmap/helpers/underscore', ['exports', 'ember-composable-helpers/helpers/underscore'], function (exports, _emberComposableHelpersHelpersUnderscore) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnderscore['default'];
    }
  });
  Object.defineProperty(exports, 'underscore', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnderscore.underscore;
    }
  });
});
define('trailmap/helpers/union', ['exports', 'ember-composable-helpers/helpers/union'], function (exports, _emberComposableHelpersHelpersUnion) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion['default'];
    }
  });
  Object.defineProperty(exports, 'union', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion.union;
    }
  });
});
define('trailmap/helpers/w', ['exports', 'ember-composable-helpers/helpers/w'], function (exports, _emberComposableHelpersHelpersW) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersW['default'];
    }
  });
  Object.defineProperty(exports, 'w', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersW.w;
    }
  });
});
define('trailmap/helpers/without', ['exports', 'ember-composable-helpers/helpers/without'], function (exports, _emberComposableHelpersHelpersWithout) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout['default'];
    }
  });
  Object.defineProperty(exports, 'without', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout.without;
    }
  });
});
define('trailmap/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
});
define('trailmap/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'trailmap/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _trailmapConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_trailmapConfigEnvironment['default'].APP.name, _trailmapConfigEnvironment['default'].APP.version)
  };
});
define('trailmap/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('trailmap/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('trailmap/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('trailmap/initializers/ember-leaflet-gh-pages-image-fix', ['exports', 'trailmap/config/environment'], function (exports, _trailmapConfigEnvironment) {
  exports.initialize = initialize;

  /* global L */

  function initialize() /* container, application */{
    L.Icon.Default.imagePath = (_trailmapConfigEnvironment['default'].prepend || '/') + 'assets/images';
  }

  exports['default'] = {
    name: 'leaflet-assets-cdn',
    initialize: initialize,
    after: 'leaflet-assets'
  };
});
define('trailmap/initializers/export-application-global', ['exports', 'ember', 'trailmap/config/environment'], function (exports, _ember, _trailmapConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_trailmapConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _trailmapConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_trailmapConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('trailmap/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('trailmap/initializers/leaflet-assets', ['exports', 'ember-leaflet/initializers/leaflet-assets'], function (exports, _emberLeafletInitializersLeafletAssets) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLeafletInitializersLeafletAssets['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberLeafletInitializersLeafletAssets.initialize;
    }
  });
});
define("trailmap/initializers/liquid-fire", ["exports", "liquid-fire/ember-internals"], function (exports, _liquidFireEmberInternals) {

  (0, _liquidFireEmberInternals.initialize)();

  exports["default"] = {
    name: 'liquid-fire',
    initialize: function initialize() {}
  };
});
define('trailmap/initializers/pagefront-beacon', ['exports', 'ember-pagefront/initializers/pagefront-beacon'], function (exports, _emberPagefrontInitializersPagefrontBeacon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPagefrontInitializersPagefrontBeacon['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberPagefrontInitializersPagefrontBeacon.initialize;
    }
  });
});
define('trailmap/initializers/responsive', ['exports', 'ember-responsive/initializers/responsive'], function (exports, _emberResponsiveInitializersResponsive) {

  /**
   * Ember responsive initializer
   *
   * Supports auto injecting media service app-wide.
   *
   * Generated by the ember-responsive addon. Customize initialize to change
   * injection.
   */

  exports['default'] = {
    name: 'responsive',
    initialize: _emberResponsiveInitializersResponsive.initialize
  };
});
define('trailmap/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('trailmap/initializers/trackjs-service', ['exports'], function (exports) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    application.inject('route', 'trackjs', 'service:trackjs');
    application.inject('controller', 'trackjs', 'service:trackjs');
  }

  exports['default'] = {
    name: 'trackjs-service',
    initialize: initialize
  };
});
define('trailmap/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('trailmap/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define('trailmap/instance-initializers/configure-trackjs', ['exports', 'ember', 'trailmap/utils/error-handler'], function (exports, _ember, _trailmapUtilsErrorHandler) {
  exports.initialize = initialize;

  function initialize(app) {
    // Guard against Ember.onerror hiding test failures
    // http://raytiley.com/posts/ember-onerror-troll
    if (_ember['default'].testing) {
      return;
    }

    var instance = app.lookup ? app : app.container;

    var trackJs = instance.lookup('service:trackjs');
    var appVersion = instance.lookup('application:main').get('version');

    trackJs.configure({
      version: appVersion
    });

    var handler = new _trailmapUtilsErrorHandler['default'](trackJs);

    _ember['default'].onerror = handler.report.bind(handler);
  }

  exports['default'] = {
    name: 'configure-trackjs',
    initialize: initialize
  };
});
define("trailmap/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('trailmap/instance-initializers/pagefront-beacon', ['exports', 'ember-pagefront/instance-initializers/pagefront-beacon'], function (exports, _emberPagefrontInstanceInitializersPagefrontBeacon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPagefrontInstanceInitializersPagefrontBeacon['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberPagefrontInstanceInitializersPagefrontBeacon.initialize;
    }
  });
});
define('trailmap/mixins/base', ['exports', 'semantic-ui-ember/mixins/base'], function (exports, _semanticUiEmberMixinsBase) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _semanticUiEmberMixinsBase['default'];
    }
  });
});
define('trailmap/mixins/promise-resolver', ['exports', 'ember-promise-tools/mixins/promise-resolver'], function (exports, _emberPromiseToolsMixinsPromiseResolver) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsMixinsPromiseResolver['default'];
    }
  });
});
define('trailmap/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('trailmap/router', ['exports', 'ember', 'trailmap/config/environment'], function (exports, _ember, _trailmapConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _trailmapConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('filters', { path: '/map' });
  });

  Router.reopen({
    notifyGoogleAnalytics: (function () {
      if (typeof ga != 'function') {
        return;
      }
      return ga('send', 'pageview', {
        'page': this.get('url'),
        'title': this.get('url')
      });
    }).on('didTransition')
  });

  exports['default'] = Router;
});
define('trailmap/routes/application', ['exports', 'ember', 'ember-computed'], function (exports, _ember, _emberComputed) {
  exports['default'] = _ember['default'].Route.extend({
    init: function init() {
      this._super.apply(this, arguments);
      this.set('locations', []);
    },
    locations: null,

    geolocation: _ember['default'].inject.service(),
    tracking: false,

    actions: {
      getLocation: function getLocation() {
        var _this = this;

        var mapController = this.controllerFor('application');
        if (this.get('tracking')) {
          this.toggleProperty('tracking');
          this.get('geolocation').stopTracking();
          mapController.set('currentLocation', null);
        } else {
          this.toggleProperty('tracking');
          this.get('geolocation').trackLocation({ enableHighAccuracy: true }, function (geoObject) {
            mapController.set('currentLocation', _this.get('geolocation.currentLocation'));
          });
        }
      }
    },

    trackLocationLine: _ember['default'].observer('geolocation.currentLocation', function () {
      if (this.get("tracking")) {
        var currentLocation = this.get('geolocation.currentLocation');
        if (currentLocation) {
          this.get('locations').pushObject({ lat: currentLocation[0], lng: currentLocation[1] });
        }
        var mapController = this.controllerFor('application');
        mapController.set('locations', this.get('locations'));
      }
    })
  });
});
define('trailmap/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('trailmap/services/geolocation', ['exports', 'ember-cli-geo/services/geolocation'], function (exports, _emberCliGeoServicesGeolocation) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliGeoServicesGeolocation['default'];
    }
  });
});
define("trailmap/services/liquid-fire-transitions", ["exports", "liquid-fire/transition-map"], function (exports, _liquidFireTransitionMap) {
  exports["default"] = _liquidFireTransitionMap["default"];
});
define('trailmap/services/media', ['exports', 'ember-responsive/media'], function (exports, _emberResponsiveMedia) {
  exports['default'] = _emberResponsiveMedia['default'];
});
define('trailmap/services/pagefront-beacon', ['exports', 'ember-pagefront/services/pagefront-beacon'], function (exports, _emberPagefrontServicesPagefrontBeacon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPagefrontServicesPagefrontBeacon['default'];
    }
  });
});
define('trailmap/services/trackjs', ['exports', 'ember-cli-trackjs/services/trackjs'], function (exports, _emberCliTrackjsServicesTrackjs) {
  exports['default'] = _emberCliTrackjsServicesTrackjs['default'];
});
define("trailmap/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 5,
                "column": 4
              },
              "end": {
                "line": 7,
                "column": 4
              }
            },
            "moduleName": "trailmap/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "tile-layer", [], ["url", "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"], ["loc", [null, [6, 6], [6, 103]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 8,
                "column": 4
              },
              "end": {
                "line": 10,
                "column": 4
              }
            },
            "moduleName": "trailmap/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "tile-layer", [], ["url", "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"], ["loc", [null, [9, 6], [9, 75]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child2 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 11,
                "column": 4
              },
              "end": {
                "line": 13,
                "column": 4
              }
            },
            "moduleName": "trailmap/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "tile-layer", [], ["url", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"], ["loc", [null, [12, 6], [12, 120]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child3 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 14,
                "column": 4
              },
              "end": {
                "line": 18,
                "column": 4
              }
            },
            "moduleName": "trailmap/templates/application.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: ["cartodb-layer"],
          templates: []
        };
      })();
      var child4 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.9.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 20,
                  "column": 6
                },
                "end": {
                  "line": 22,
                  "column": 6
                }
              },
              "moduleName": "trailmap/templates/application.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "polyline-layer", [], ["smoothFactor", 5, "locations", ["subexpr", "@mut", [["get", "locations", ["loc", [null, [21, 50], [21, 59]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [21, 8], [21, 61]]], 0, 0]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 19,
                "column": 4
              },
              "end": {
                "line": 24,
                "column": 4
              }
            },
            "moduleName": "trailmap/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
            dom.insertBoundary(fragment, 0);
            return morphs;
          },
          statements: [["block", "if", [["get", "locations", ["loc", [null, [20, 12], [20, 21]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [20, 6], [22, 13]]]], ["inline", "marker-layer", [], ["location", ["subexpr", "@mut", [["get", "currentLocation", ["loc", [null, [23, 30], [23, 45]]], 0, 0, 0, 0]], [], [], 0, 0], "icon", ["subexpr", "@mut", [["get", "customIcon", ["loc", [null, [23, 51], [23, 61]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [23, 6], [23, 63]]], 0, 0]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 2
            },
            "end": {
              "line": 25,
              "column": 2
            }
          },
          "moduleName": "trailmap/templates/application.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(5);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[2] = dom.createMorphAt(fragment, 2, 2, contextualElement);
          morphs[3] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          morphs[4] = dom.createMorphAt(fragment, 4, 4, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["subexpr", "eq", [["get", "basemap", ["loc", [null, [5, 14], [5, 21]]], 0, 0, 0, 0], "default"], [], ["loc", [null, [5, 10], [5, 32]]], 0, 0]], [], 0, null, ["loc", [null, [5, 4], [7, 11]]]], ["block", "if", [["subexpr", "eq", [["get", "basemap", ["loc", [null, [8, 14], [8, 21]]], 0, 0, 0, 0], "osm"], [], ["loc", [null, [8, 10], [8, 28]]], 0, 0]], [], 1, null, ["loc", [null, [8, 4], [10, 11]]]], ["block", "if", [["subexpr", "eq", [["get", "basemap", ["loc", [null, [11, 14], [11, 21]]], 0, 0, 0, 0], "satellite"], [], ["loc", [null, [11, 10], [11, 34]]], 0, 0]], [], 2, null, ["loc", [null, [11, 4], [13, 11]]]], ["block", "cartodb-layer", [], ["sublayers", ["subexpr", "@mut", [["get", "sublayers", ["loc", [null, [15, 16], [15, 25]]], 0, 0, 0, 0]], [], [], 0, 0], "proposed", ["subexpr", "@mut", [["get", "proposed", ["loc", [null, [15, 35], [15, 43]]], 0, 0, 0, 0]], [], [], 0, 0], "https", true, "onLoad", "getLayer", "url", "https://mapc.carto.com/u/mapc-admin/api/v2/viz/ffb06642-d6ab-11e6-b416-0e233c30368f/viz.json", "zIndex", 1, "legends", false, "search", true], 3, null, ["loc", [null, [14, 4], [18, 22]]]], ["block", "if", [["get", "currentLocation", ["loc", [null, [19, 10], [19, 25]]], 0, 0, 0, 0]], [], 4, null, ["loc", [null, [19, 4], [24, 11]]]]],
        locals: ["layers"],
        templates: [child0, child1, child2, child3, child4]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 0
          }
        },
        "moduleName": "trailmap/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("main");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]), 1, 1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "liquid-outlet", ["loc", [null, [1, 0], [1, 17]]], 0, 0, 0, 0], ["block", "leaflet-map", [], ["lat", ["subexpr", "@mut", [["get", "lat", ["loc", [null, [4, 21], [4, 24]]], 0, 0, 0, 0]], [], [], 0, 0], "lng", ["subexpr", "@mut", [["get", "lng", ["loc", [null, [4, 29], [4, 32]]], 0, 0, 0, 0]], [], [], 0, 0], "zoom", ["subexpr", "@mut", [["get", "zoom", ["loc", [null, [4, 38], [4, 42]]], 0, 0, 0, 0]], [], [], 0, 0], "zoomControl", false, "onMoveend", ["subexpr", "action", ["updatePosition"], [], ["loc", [null, [4, 71], [4, 96]]], 0, 0]], 0, null, ["loc", [null, [4, 2], [25, 18]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("trailmap/templates/components/cartodb-layer", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "trailmap/templates/components/cartodb-layer.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "ui active map loader");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "ui loader");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 0
          }
        },
        "moduleName": "trailmap/templates/components/cartodb-layer.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0], ["block", "if", [["get", "loading", ["loc", [null, [2, 6], [2, 13]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [2, 0], [6, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("trailmap/templates/components/scoped-array-checklist", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 7,
                "column": 4
              },
              "end": {
                "line": 9,
                "column": 4
              }
            },
            "moduleName": "trailmap/templates/components/scoped-array-checklist.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.setAttribute(el1, "class", "minus icon");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createAttrMorph(element0, 'style');
            return morphs;
          },
          statements: [["attribute", "style", ["concat", ["color: ", ["get", "item.color", ["loc", [null, [8, 44], [8, 54]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 11,
              "column": 0
            }
          },
          "moduleName": "trailmap/templates/components/scoped-array-checklist.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "class", "item");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createElementMorph(element1);
          morphs[1] = dom.createMorphAt(element1, 1, 1);
          morphs[2] = dom.createMorphAt(element1, 3, 3);
          return morphs;
        },
        statements: [["element", "action", ["toggleItem", ["get", "item", ["loc", [null, [2, 40], [2, 44]]], 0, 0, 0, 0]], [], ["loc", [null, [2, 18], [2, 46]]], 0, 0], ["inline", "ui-checkbox", [], ["label", ["subexpr", "@mut", [["get", "item.label", ["loc", [null, [4, 12], [4, 22]]], 0, 0, 0, 0]], [], [], 0, 0], "checked", ["subexpr", "contains", [["get", "item.value", ["loc", [null, [5, 24], [5, 34]]], 0, 0, 0, 0], ["get", "parsedValuesList", ["loc", [null, [5, 35], [5, 51]]], 0, 0, 0, 0]], [], ["loc", [null, [5, 14], [5, 52]]], 0, 0], "onChange", ["subexpr", "action", ["toggleItem", ["get", "item", ["loc", [null, [6, 36], [6, 40]]], 0, 0, 0, 0]], [], ["loc", [null, [6, 15], [6, 41]]], 0, 0]], ["loc", [null, [3, 4], [6, 43]]], 0, 0], ["block", "if", [["subexpr", "contains", [["get", "item.value", ["loc", [null, [7, 20], [7, 30]]], 0, 0, 0, 0], ["get", "parsedValuesList", ["loc", [null, [7, 31], [7, 47]]], 0, 0, 0, 0]], [], ["loc", [null, [7, 10], [7, 48]]], 0, 0]], [], 0, null, ["loc", [null, [7, 4], [9, 11]]]]],
        locals: ["item"],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 9
          }
        },
        "moduleName": "trailmap/templates/components/scoped-array-checklist.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "each", [["get", "checklistItems", ["loc", [null, [1, 8], [1, 22]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [11, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("trailmap/templates/components/splash-intro", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 15,
              "column": 8
            },
            "end": {
              "line": 17,
              "column": 8
            }
          },
          "moduleName": "trailmap/templates/components/splash-intro.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "class", "inverted map icon");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("LandLine Network\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 58,
            "column": 0
          }
        },
        "moduleName": "trailmap/templates/components/splash-intro.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "splash");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "ui container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        dom.setAttribute(el3, "class", "ui inverted header logo");
        dom.setAttribute(el3, "style", "display: none;");
        var el4 = dom.createTextNode("\n      Welcome to Trailmap\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "ui inverted divider");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        dom.setAttribute(el3, "style", "display: none;");
        var el4 = dom.createTextNode("Trailmap is a growing compendium of the region's walking and bicycling facilities. Trailmap hopes to provide a single place for planning and exploring the region by foot and on bicycle.\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "ui stackable equal width center aligned two column grid");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "column");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "class", "ui big inverted fluid button");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6, "class", "inverted map pin icon");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("Trails Near You");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "column");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "options");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "ui container");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "other-content");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "ui container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "ui basic segment");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h2");
        dom.setAttribute(el5, "class", "ui inverted header");
        var el6 = dom.createTextNode("\n          Who made this map?\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5, "style", "display: none;");
        var el6 = dom.createTextNode("This map was created by MAPC with contributions from cities, towns, state agencies, land trusts, other organizations, and individuals. This map is updated on a regular basis, incorporating new data and corrections. However, Data gaps exist, particularly with walking trails.\n       ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "ui basic segment");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h2");
        dom.setAttribute(el5, "class", "ui inverted header");
        var el6 = dom.createTextNode("\n         What is the data on this map?\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5, "style", "display: none;");
        var el6 = dom.createTextNode("Walking Facilities - include hiking trails in conservation lands, paths through campuses, institutions, city parks, and other pedestrian facilities that are not along roadways. Bicycle Facilities – includes on-road designated facilities including bicycle lanes, shared lane markings, cycle tracks, and select on-road connections. Shared Use Paths – includes trails on former railroad rights-of-way, rivers, and other corridors which are designed for shared use by cyclists, walkers, and other nonmotorized transport. Improved paths are either paved, or with a stabilized firm surface, ideal for use by road bicycles, wheelchairs, strollers etc. Unimproved paths have a rough surface, and are therefore generally limited to hiking and mountain biking uses. Regional Networks – includes linear corridors that have been signed or otherwise designated. Walking trails include the Bay Circuit, Charles River Link, Warner Trail, Western Greenway, and proposed Metrowest aqueduct trail system. Bicycle routes include the East Coast Greenway and the Claire Saltonstall Bikeway.\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("footer");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "ui stackable equal width center aligned padded three column grid");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "column");
        var el5 = dom.createTextNode("\n        MAPC\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "column");
        var el5 = dom.createTextNode("\n        MAPC\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "column");
        var el5 = dom.createTextNode("\n        MAPC\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 7]);
        var element1 = dom.childAt(element0, [1, 1]);
        var morphs = new Array(2);
        morphs[0] = dom.createElementMorph(element1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        return morphs;
      },
      statements: [["element", "action", [["get", "trackLocation", ["loc", [null, [12, 62], [12, 75]]], 0, 0, 0, 0]], [], ["loc", [null, [12, 53], [12, 77]]], 0, 0], ["block", "link-to", ["filters", ["subexpr", "query-params", [], ["landline", true, "shared", false, "bike_lane", false, "walk", false, "multi_use_path", false], ["loc", [null, [15, 29], [15, 118]]], 0, 0]], ["class", "ui big inverted fluid button", "tagName", "button"], 0, null, ["loc", [null, [15, 8], [17, 20]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("trailmap/templates/components/ui-accordion", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "trailmap/templates/components/ui-accordion.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-checkbox", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "trailmap/templates/components/ui-checkbox.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "yield", [["subexpr", "hash", [], ["type", ["get", "type", ["loc", [null, [2, 21], [2, 25]]], 0, 0, 0, 0], "name", ["get", "name", ["loc", [null, [2, 31], [2, 35]]], 0, 0, 0, 0], "label", ["get", "label", ["loc", [null, [2, 42], [2, 47]]], 0, 0, 0, 0], "checked", ["get", "checked", ["loc", [null, [2, 56], [2, 63]]], 0, 0, 0, 0], "disabled", ["get", "disabled", ["loc", [null, [2, 73], [2, 81]]], 0, 0, 0, 0], "execute", ["subexpr", "action", ["execute"], [], ["loc", [null, [2, 90], [2, 108]]], 0, 0]], ["loc", [null, [2, 10], [2, 109]]], 0, 0]], [], ["loc", [null, [2, 2], [2, 112]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 14,
              "column": 0
            }
          },
          "moduleName": "trailmap/templates/components/ui-checkbox.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("input");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("label");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          if (this.cachedFragment) {
            dom.repairClonedNode(element0, [], true);
          }
          var morphs = new Array(7);
          morphs[0] = dom.createAttrMorph(element0, 'type');
          morphs[1] = dom.createAttrMorph(element0, 'name');
          morphs[2] = dom.createAttrMorph(element0, 'tabindex');
          morphs[3] = dom.createAttrMorph(element0, 'checked');
          morphs[4] = dom.createAttrMorph(element0, 'disabled');
          morphs[5] = dom.createMorphAt(dom.childAt(fragment, [3]), 1, 1);
          morphs[6] = dom.createMorphAt(fragment, 5, 5, contextualElement);
          return morphs;
        },
        statements: [["attribute", "type", ["get", "type", ["loc", [null, [4, 16], [4, 20]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "name", ["get", "name", ["loc", [null, [5, 16], [5, 20]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "tabindex", ["get", "tabindex", ["loc", [null, [6, 20], [6, 28]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "checked", ["subexpr", "unbound", [["get", "checked", ["loc", [null, [7, 27], [7, 34]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [7, 36]]], 0, 0], 0, 0, 0, 0], ["attribute", "disabled", ["subexpr", "unbound", [["get", "disabled", ["loc", [null, [8, 28], [8, 36]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [8, 38]]], 0, 0], 0, 0, 0, 0], ["content", "label", ["loc", [null, [10, 2], [10, 11]]], 0, 0, 0, 0], ["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [13, 10], [13, 28]]], 0, 0]], [], ["loc", [null, [13, 2], [13, 30]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 0
          }
        },
        "moduleName": "trailmap/templates/components/ui-checkbox.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "hasBlock", ["loc", [null, [1, 6], [1, 14]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [14, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("trailmap/templates/components/ui-dimmer", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "trailmap/templates/components/ui-dimmer.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-dropdown", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 47
          }
        },
        "moduleName": "trailmap/templates/components/ui-dropdown.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0], ["subexpr", "action", ["mapping"], [], ["loc", [null, [1, 27], [1, 45]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 47]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-embed", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-embed.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-modal", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-modal.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-nag", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-nag.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-popup", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-popup.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-progress", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-progress.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-radio", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-radio.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("input");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("label");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        if (this.cachedFragment) {
          dom.repairClonedNode(element0, [], true);
        }
        var morphs = new Array(7);
        morphs[0] = dom.createAttrMorph(element0, 'type');
        morphs[1] = dom.createAttrMorph(element0, 'name');
        morphs[2] = dom.createAttrMorph(element0, 'tabindex');
        morphs[3] = dom.createAttrMorph(element0, 'checked');
        morphs[4] = dom.createAttrMorph(element0, 'disabled');
        morphs[5] = dom.createMorphAt(dom.childAt(fragment, [2]), 0, 0);
        morphs[6] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["attribute", "type", ["get", "type", ["loc", [null, [1, 14], [1, 18]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "name", ["get", "name", ["loc", [null, [2, 14], [2, 18]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "tabindex", ["get", "tabindex", ["loc", [null, [3, 18], [3, 26]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "checked", ["subexpr", "unbound", [["get", "checked", ["loc", [null, [4, 25], [4, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [4, 34]]], 0, 0], 0, 0, 0, 0], ["attribute", "disabled", ["subexpr", "unbound", [["get", "disabled", ["loc", [null, [5, 26], [5, 34]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [5, 36]]], 0, 0], 0, 0, 0, 0], ["content", "label", ["loc", [null, [6, 7], [6, 16]]], 0, 0, 0, 0], ["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [7, 8], [7, 26]]], 0, 0]], [], ["loc", [null, [7, 0], [7, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-rating", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-rating.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-search", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-search.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-shape", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-shape.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-sidebar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-sidebar.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/components/ui-sticky", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 28
          }
        },
        "moduleName": "trailmap/templates/components/ui-sticky.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", ["execute"], [], ["loc", [null, [1, 8], [1, 26]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 28]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("trailmap/templates/filters", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.9.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 24,
                  "column": 14
                },
                "end": {
                  "line": 26,
                  "column": 14
                }
              },
              "moduleName": "trailmap/templates/filters.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("i");
              dom.setAttribute(el1, "class", "minus icon");
              dom.setAttribute(el1, "style", "color: #7f3193;");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();
        var child1 = (function () {
          return {
            meta: {
              "revision": "Ember@2.9.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 32,
                  "column": 14
                },
                "end": {
                  "line": 34,
                  "column": 14
                }
              },
              "moduleName": "trailmap/templates/filters.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("i");
              dom.setAttribute(el1, "class", "minus icon");
              dom.setAttribute(el1, "style", "color: #82C5EC;");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();
        var child2 = (function () {
          return {
            meta: {
              "revision": "Ember@2.9.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 40,
                  "column": 14
                },
                "end": {
                  "line": 42,
                  "column": 14
                }
              },
              "moduleName": "trailmap/templates/filters.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("i");
              dom.setAttribute(el1, "class", "minus icon");
              dom.setAttribute(el1, "style", "color: #0874b9;");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 10,
                "column": 8
              },
              "end": {
                "line": 45,
                "column": 8
              }
            },
            "moduleName": "trailmap/templates/filters.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1, "class", "ui child attached title item");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "dropdown icon");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "child content link menu");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            dom.setAttribute(el2, "class", "item");
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            dom.setAttribute(el2, "class", "item");
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            dom.setAttribute(el2, "class", "item");
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [3]);
            var element2 = dom.childAt(element1, [1]);
            var element3 = dom.childAt(element1, [3]);
            var element4 = dom.childAt(element1, [5]);
            var morphs = new Array(10);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
            morphs[1] = dom.createElementMorph(element2);
            morphs[2] = dom.createMorphAt(element2, 1, 1);
            morphs[3] = dom.createMorphAt(element2, 3, 3);
            morphs[4] = dom.createElementMorph(element3);
            morphs[5] = dom.createMorphAt(element3, 1, 1);
            morphs[6] = dom.createMorphAt(element3, 3, 3);
            morphs[7] = dom.createElementMorph(element4);
            morphs[8] = dom.createMorphAt(element4, 1, 1);
            morphs[9] = dom.createMorphAt(element4, 3, 3);
            return morphs;
          },
          statements: [["inline", "ui-checkbox", [], ["class", "parent-checkbox", "label", "Bike", "checked", ["subexpr", "or", [["get", "applicationController.protected", ["loc", [null, [15, 26], [15, 57]]], 0, 0, 0, 0], ["get", "applicationController.shared", ["loc", [null, [15, 58], [15, 86]]], 0, 0, 0, 0], ["get", "applicationController.bike_lane", ["loc", [null, [15, 87], [15, 118]]], 0, 0, 0, 0]], [], ["loc", [null, [15, 22], [15, 119]]], 0, 0], "onChange", ["subexpr", "action", ["toggleAll", ["subexpr", "array", ["protected", "shared", "bike_lane"], [], ["loc", [null, [16, 43], [16, 83]]], 0, 0]], [], ["loc", [null, [16, 23], [16, 84]]], 0, 0]], ["loc", [null, [12, 12], [16, 86]]], 0, 0], ["element", "action", [["subexpr", "toggle", ["protected", ["get", "applicationController", ["loc", [null, [20, 57], [20, 78]]], 0, 0, 0, 0]], [], ["loc", [null, [20, 37], [20, 79]]], 0, 0]], [], ["loc", [null, [20, 28], [20, 81]]], 0, 0], ["inline", "ui-checkbox", [], ["label", "Protected Bike Lane", "checked", ["subexpr", "@mut", [["get", "applicationController.protected", ["loc", [null, [23, 24], [23, 55]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [21, 14], [23, 57]]], 0, 0], ["block", "if", [["get", "applicationController.protected", ["loc", [null, [24, 20], [24, 51]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [24, 14], [26, 21]]]], ["element", "action", [["subexpr", "toggle", ["shared", ["get", "applicationController", ["loc", [null, [28, 54], [28, 75]]], 0, 0, 0, 0]], [], ["loc", [null, [28, 37], [28, 76]]], 0, 0]], [], ["loc", [null, [28, 28], [28, 78]]], 0, 0], ["inline", "ui-checkbox", [], ["label", "Shared Lane Marking", "checked", ["subexpr", "@mut", [["get", "applicationController.shared", ["loc", [null, [31, 24], [31, 52]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [29, 14], [31, 54]]], 0, 0], ["block", "if", [["get", "applicationController.shared", ["loc", [null, [32, 20], [32, 48]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [32, 14], [34, 21]]]], ["element", "action", [["subexpr", "toggle", ["bike_lane", ["get", "applicationController", ["loc", [null, [36, 57], [36, 78]]], 0, 0, 0, 0]], [], ["loc", [null, [36, 37], [36, 79]]], 0, 0]], [], ["loc", [null, [36, 28], [36, 81]]], 0, 0], ["inline", "ui-checkbox", [], ["label", "Bike Lane", "checked", ["subexpr", "@mut", [["get", "applicationController.bike_lane", ["loc", [null, [39, 24], [39, 55]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [37, 14], [39, 57]]], 0, 0], ["block", "if", [["get", "applicationController.bike_lane", ["loc", [null, [40, 20], [40, 51]]], 0, 0, 0, 0]], [], 2, null, ["loc", [null, [40, 14], [42, 21]]]]],
          locals: [],
          templates: [child0, child1, child2]
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 50,
                "column": 10
              },
              "end": {
                "line": 52,
                "column": 10
              }
            },
            "moduleName": "trailmap/templates/filters.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.setAttribute(el1, "class", "minus icon");
            dom.setAttribute(el1, "style", "color: #db813f");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child2 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 58,
                "column": 10
              },
              "end": {
                "line": 60,
                "column": 10
              }
            },
            "moduleName": "trailmap/templates/filters.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.setAttribute(el1, "class", "minus icon");
            dom.setAttribute(el1, "style", "color: #38A800;");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child3 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 62,
                "column": 8
              },
              "end": {
                "line": 68,
                "column": 8
              }
            },
            "moduleName": "trailmap/templates/filters.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "menu");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "item legend");
            var el3 = dom.createTextNode("\n              Unimproved ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("i");
            dom.setAttribute(el3, "class", "minus icon");
            dom.setAttribute(el3, "style", "color: #a87000;");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child4 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 75,
                "column": 8
              },
              "end": {
                "line": 87,
                "column": 8
              }
            },
            "moduleName": "trailmap/templates/filters.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "menu");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "item legend");
            var el3 = dom.createTextNode("\n              Greeway Route ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("i");
            dom.setAttribute(el3, "class", "minus icon");
            dom.setAttribute(el3, "style", "color: #ffcc00");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "item legend");
            var el3 = dom.createTextNode("\n              Regional Walking Trail ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("i");
            dom.setAttribute(el3, "class", "minus icon");
            dom.setAttribute(el3, "style", "color: #c696b7");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "item legend");
            var el3 = dom.createTextNode("\n              Combination ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("i");
            dom.setAttribute(el3, "class", "minus icon");
            dom.setAttribute(el3, "style", "color: #d6a583");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child5 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.9.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 95,
                  "column": 12
                },
                "end": {
                  "line": 102,
                  "column": 12
                }
              },
              "moduleName": "trailmap/templates/filters.hbs"
            },
            isEmpty: true,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();
        var child1 = (function () {
          return {
            meta: {
              "revision": "Ember@2.9.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 103,
                  "column": 12
                },
                "end": {
                  "line": 110,
                  "column": 12
                }
              },
              "moduleName": "trailmap/templates/filters.hbs"
            },
            isEmpty: true,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();
        var child2 = (function () {
          return {
            meta: {
              "revision": "Ember@2.9.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 111,
                  "column": 12
                },
                "end": {
                  "line": 118,
                  "column": 12
                }
              },
              "moduleName": "trailmap/templates/filters.hbs"
            },
            isEmpty: true,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 89,
                "column": 8
              },
              "end": {
                "line": 120,
                "column": 8
              }
            },
            "moduleName": "trailmap/templates/filters.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1, "class", "ui child active attached title item");
            var el2 = dom.createTextNode("\n            Basemaps\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "dropdown icon");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "child active content");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [3]);
            var morphs = new Array(3);
            morphs[0] = dom.createMorphAt(element0, 1, 1);
            morphs[1] = dom.createMorphAt(element0, 2, 2);
            morphs[2] = dom.createMorphAt(element0, 3, 3);
            return morphs;
          },
          statements: [["block", "ui-radio", [], ["class", "item icon", "name", "default", "label", "Default", "value", "default", "current", ["subexpr", "@mut", [["get", "applicationController.basemap", ["loc", [null, [100, 22], [100, 51]]], 0, 0, 0, 0]], [], [], 0, 0], "onChange", ["subexpr", "action", [["subexpr", "mut", [["get", "applicationController.basemap", ["loc", [null, [101, 36], [101, 65]]], 0, 0, 0, 0]], [], ["loc", [null, [101, 31], [101, 66]]], 0, 0]], [], ["loc", [null, [101, 23], [101, 68]]], 0, 0]], 0, null, ["loc", [null, [95, 12], [102, 25]]]], ["block", "ui-radio", [], ["class", "item icon", "name", "osm", "label", "Open Street Map", "value", "osm", "current", ["subexpr", "@mut", [["get", "applicationController.basemap", ["loc", [null, [108, 22], [108, 51]]], 0, 0, 0, 0]], [], [], 0, 0], "onChange", ["subexpr", "action", [["subexpr", "mut", [["get", "applicationController.basemap", ["loc", [null, [109, 36], [109, 65]]], 0, 0, 0, 0]], [], ["loc", [null, [109, 31], [109, 66]]], 0, 0]], [], ["loc", [null, [109, 23], [109, 68]]], 0, 0]], 1, null, ["loc", [null, [103, 12], [110, 25]]]], ["block", "ui-radio", [], ["class", "item icon", "name", "satellite", "label", "Satellite", "value", "satellite", "current", ["subexpr", "@mut", [["get", "applicationController.basemap", ["loc", [null, [116, 22], [116, 51]]], 0, 0, 0, 0]], [], [], 0, 0], "onChange", ["subexpr", "action", [["subexpr", "mut", [["get", "applicationController.basemap", ["loc", [null, [117, 36], [117, 65]]], 0, 0, 0, 0]], [], ["loc", [null, [117, 31], [117, 66]]], 0, 0]], [], ["loc", [null, [117, 23], [117, 68]]], 0, 0]], 2, null, ["loc", [null, [111, 12], [118, 25]]]]],
          locals: [],
          templates: [child0, child1, child2]
        };
      })();
      var child6 = (function () {
        return {
          meta: {
            "revision": "Ember@2.9.1",
            "loc": {
              "source": null,
              "start": {
                "line": 123,
                "column": 10
              },
              "end": {
                "line": 125,
                "column": 10
              }
            },
            "moduleName": "trailmap/templates/filters.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.setAttribute(el1, "class", "ellipsis horizontal icon");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.9.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 4
            },
            "end": {
              "line": 128,
              "column": 4
            }
          },
          "moduleName": "trailmap/templates/filters.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h3");
          dom.setAttribute(el1, "class", "ui parent active title item");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "dropdown right floated icon");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        Trailmap Filters\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2, "class", "item");
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2, "class", "item");
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2, "class", "item");
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "item");
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element5 = dom.childAt(fragment, [3]);
          var element6 = dom.childAt(element5, [3]);
          var element7 = dom.childAt(element5, [5]);
          var element8 = dom.childAt(element5, [9]);
          var element9 = dom.childAt(element5, [15]);
          var morphs = new Array(15);
          morphs[0] = dom.createAttrMorph(element5, 'class');
          morphs[1] = dom.createMorphAt(element5, 1, 1);
          morphs[2] = dom.createElementMorph(element6);
          morphs[3] = dom.createMorphAt(element6, 1, 1);
          morphs[4] = dom.createMorphAt(element6, 3, 3);
          morphs[5] = dom.createElementMorph(element7);
          morphs[6] = dom.createMorphAt(element7, 1, 1);
          morphs[7] = dom.createMorphAt(element7, 3, 3);
          morphs[8] = dom.createMorphAt(element5, 7, 7);
          morphs[9] = dom.createElementMorph(element8);
          morphs[10] = dom.createMorphAt(element8, 1, 1);
          morphs[11] = dom.createMorphAt(element5, 11, 11);
          morphs[12] = dom.createMorphAt(element5, 13, 13);
          morphs[13] = dom.createMorphAt(element9, 1, 1);
          morphs[14] = dom.createMorphAt(element9, 3, 3);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["ui parent ", ["subexpr", "if", [["subexpr", "not", [["get", "media.isMobile", ["loc", [null, [9, 38], [9, 52]]], 0, 0, 0, 0]], [], ["loc", [null, [9, 33], [9, 53]]], 0, 0], "active"], [], ["loc", [null, [9, 28], [9, 64]]], 0, 0], " content"], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["block", "ui-accordion", [], ["exclusive", true], 0, null, ["loc", [null, [10, 8], [45, 25]]]], ["element", "action", [["subexpr", "toggle", ["walk", ["get", "applicationController", ["loc", [null, [46, 48], [46, 69]]], 0, 0, 0, 0]], [], ["loc", [null, [46, 33], [46, 70]]], 0, 0]], [], ["loc", [null, [46, 24], [46, 72]]], 0, 0], ["inline", "ui-checkbox", [], ["label", "Walk", "checked", ["subexpr", "@mut", [["get", "applicationController.walk", ["loc", [null, [49, 20], [49, 46]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [47, 10], [49, 48]]], 0, 0], ["block", "if", [["get", "applicationController.walk", ["loc", [null, [50, 16], [50, 42]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [50, 10], [52, 17]]]], ["element", "action", [["subexpr", "toggle", ["multi_use_path", ["get", "applicationController", ["loc", [null, [54, 58], [54, 79]]], 0, 0, 0, 0]], [], ["loc", [null, [54, 33], [54, 80]]], 0, 0]], [], ["loc", [null, [54, 24], [54, 82]]], 0, 0], ["inline", "ui-checkbox", [], ["label", "Multi-Use Path", "checked", ["subexpr", "@mut", [["get", "applicationController.multi_use_path", ["loc", [null, [57, 20], [57, 56]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [55, 10], [57, 58]]], 0, 0], ["block", "if", [["get", "applicationController.multi_use_path", ["loc", [null, [58, 16], [58, 52]]], 0, 0, 0, 0]], [], 2, null, ["loc", [null, [58, 10], [60, 17]]]], ["block", "if", [["get", "applicationController.multi_use_path", ["loc", [null, [62, 14], [62, 50]]], 0, 0, 0, 0]], [], 3, null, ["loc", [null, [62, 8], [68, 15]]]], ["element", "action", [["subexpr", "toggle", ["landline", ["get", "applicationController", ["loc", [null, [69, 52], [69, 73]]], 0, 0, 0, 0]], [], ["loc", [null, [69, 33], [69, 74]]], 0, 0]], [], ["loc", [null, [69, 24], [69, 76]]], 0, 0], ["inline", "ui-checkbox", [], ["label", "LandLine (Metro Greenway Network)", "checked", ["subexpr", "@mut", [["get", "applicationController.landline", ["loc", [null, [72, 20], [72, 50]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [70, 10], [72, 52]]], 0, 0], ["block", "if", [["get", "applicationController.landline", ["loc", [null, [75, 14], [75, 44]]], 0, 0, 0, 0]], [], 4, null, ["loc", [null, [75, 8], [87, 15]]]], ["block", "ui-accordion", [], ["exclusive", true], 5, null, ["loc", [null, [89, 8], [120, 25]]]], ["inline", "ui-checkbox", [], ["class", "ui toggle checkbox", "onChange", ["subexpr", "action", [["subexpr", "mut", [["get", "applicationController.proposed", ["loc", [null, [122, 73], [122, 103]]], 0, 0, 0, 0]], [], ["loc", [null, [122, 68], [122, 104]]], 0, 0]], [], ["loc", [null, [122, 60], [122, 105]]], 0, 0], "checked", ["subexpr", "@mut", [["get", "applicationController.proposed", ["loc", [null, [122, 114], [122, 144]]], 0, 0, 0, 0]], [], [], 0, 0], "label", "Proposed Trails"], ["loc", [null, [122, 10], [122, 170]]], 0, 0], ["block", "if", [["get", "applicationController.proposed", ["loc", [null, [123, 16], [123, 46]]], 0, 0, 0, 0]], [], 6, null, ["loc", [null, [123, 10], [125, 17]]]]],
        locals: [],
        templates: [child0, child1, child2, child3, child4, child5, child6]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 130,
            "column": 6
          }
        },
        "moduleName": "trailmap/templates/filters.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1, "class", "filters");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "ui link vertical menu");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]), 1, 1);
        return morphs;
      },
      statements: [["block", "ui-accordion", [], ["class", "ui accordion"], 0, null, ["loc", [null, [3, 4], [128, 21]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("trailmap/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.9.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "trailmap/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "splash-intro", [], ["trackLocation", ["subexpr", "action", ["trackLocation"], ["target", ["get", "applicationController", ["loc", [null, [1, 60], [1, 81]]], 0, 0, 0, 0]], ["loc", [null, [1, 29], [1, 82]]], 0, 0]], ["loc", [null, [1, 0], [1, 84]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define('trailmap/transitions', ['exports'], function (exports) {
  exports['default'] = function () {
    this.transition(this.fromRoute('index'), this.toRoute('filters'), this.use('fade'), this.reverse('fade'));
  };

  ;
});
define('trailmap/transitions/cross-fade', ['exports', 'liquid-fire/transitions/cross-fade'], function (exports, _liquidFireTransitionsCrossFade) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsCrossFade['default'];
    }
  });
});
define('trailmap/transitions/default', ['exports', 'liquid-fire/transitions/default'], function (exports, _liquidFireTransitionsDefault) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsDefault['default'];
    }
  });
});
define('trailmap/transitions/explode', ['exports', 'liquid-fire/transitions/explode'], function (exports, _liquidFireTransitionsExplode) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsExplode['default'];
    }
  });
});
define('trailmap/transitions/fade', ['exports', 'liquid-fire/transitions/fade'], function (exports, _liquidFireTransitionsFade) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsFade['default'];
    }
  });
});
define('trailmap/transitions/flex-grow', ['exports', 'liquid-fire/transitions/flex-grow'], function (exports, _liquidFireTransitionsFlexGrow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsFlexGrow['default'];
    }
  });
});
define('trailmap/transitions/fly-to', ['exports', 'liquid-fire/transitions/fly-to'], function (exports, _liquidFireTransitionsFlyTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsFlyTo['default'];
    }
  });
});
define('trailmap/transitions/move-over', ['exports', 'liquid-fire/transitions/move-over'], function (exports, _liquidFireTransitionsMoveOver) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsMoveOver['default'];
    }
  });
});
define('trailmap/transitions/scale', ['exports', 'liquid-fire/transitions/scale'], function (exports, _liquidFireTransitionsScale) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsScale['default'];
    }
  });
});
define('trailmap/transitions/scroll-then', ['exports', 'liquid-fire/transitions/scroll-then'], function (exports, _liquidFireTransitionsScrollThen) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsScrollThen['default'];
    }
  });
});
define('trailmap/transitions/to-down', ['exports', 'liquid-fire/transitions/to-down'], function (exports, _liquidFireTransitionsToDown) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsToDown['default'];
    }
  });
});
define('trailmap/transitions/to-left', ['exports', 'liquid-fire/transitions/to-left'], function (exports, _liquidFireTransitionsToLeft) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsToLeft['default'];
    }
  });
});
define('trailmap/transitions/to-right', ['exports', 'liquid-fire/transitions/to-right'], function (exports, _liquidFireTransitionsToRight) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsToRight['default'];
    }
  });
});
define('trailmap/transitions/to-up', ['exports', 'liquid-fire/transitions/to-up'], function (exports, _liquidFireTransitionsToUp) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsToUp['default'];
    }
  });
});
define('trailmap/transitions/wait', ['exports', 'liquid-fire/transitions/wait'], function (exports, _liquidFireTransitionsWait) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsWait['default'];
    }
  });
});
define('trailmap/utils/error-handler', ['exports', 'ember-cli-trackjs/utils/error-handler'], function (exports, _emberCliTrackjsUtilsErrorHandler) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliTrackjsUtilsErrorHandler['default'];
    }
  });
});
define('trailmap/utils/get-promise-content', ['exports', 'ember-promise-tools/utils/get-promise-content'], function (exports, _emberPromiseToolsUtilsGetPromiseContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsUtilsGetPromiseContent['default'];
    }
  });
});
define('trailmap/utils/is-fulfilled', ['exports', 'ember-promise-tools/utils/is-fulfilled'], function (exports, _emberPromiseToolsUtilsIsFulfilled) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsUtilsIsFulfilled['default'];
    }
  });
});
define('trailmap/utils/is-promise', ['exports', 'ember-promise-tools/utils/is-promise'], function (exports, _emberPromiseToolsUtilsIsPromise) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsUtilsIsPromise['default'];
    }
  });
});
define('trailmap/utils/smart-resolve', ['exports', 'ember-promise-tools/utils/smart-resolve'], function (exports, _emberPromiseToolsUtilsSmartResolve) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPromiseToolsUtilsSmartResolve['default'];
    }
  });
});
define('trailmap/utils/titleize', ['exports', 'ember-composable-helpers/utils/titleize'], function (exports, _emberComposableHelpersUtilsTitleize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersUtilsTitleize['default'];
    }
  });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('trailmap/config/environment', ['ember'], function(Ember) {
  var prefix = 'trailmap';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("trailmap/app")["default"].create({"filters":[{"name":"fac_type","alias":"bike_fac_type","table":"bike_facilities","type":"list"},{"name":"fac_type_status","alias":"bike_fac_type_status","table":"bike_facilities","type":"list"},{"name":"fac_type_simp_code","alias":"walk_fac_type","table":"walking_trails","type":"list"},{"name":"fac_type","alias":"dual_fac_type","table":"bike_facilities","type":"list"},{"name":"none","alias":"land_line_type","table":"landline_regional_greenways","type":"toggle"}],"domains":{"bike_fac_type":{"name":"fac_type","type":"esriFieldTypeSmallInteger","alias":"Facility Type","domain":{"type":"codedValue","name":"fac_type","codedValues":[{"name":"Protected Bike Lane","code":2,"color":"#7f3193"},{"name":"Shared Lane Marking","code":9,"color":"#82C5EC"},{"name":"Bike Lane","code":1,"color":"#0874b9"}]},"editable":true,"nullable":false},"bike_fac_type_status":{"name":"fac_type","type":"esriFieldTypeSmallInteger","alias":"Facility Type","domain":{"type":"codedValue","name":"fac_stat","codedValues":[{"name":"Existing","code":1},{"name":"Proposed","code":2}]}},"walk_fac_type":{"name":"fac_type_simp_code","type":"esriFieldTypeSmallInteger","alias":"Facility Type","domain":{"type":"codedValue","name":"fac_type_simp_code","codedValues":[{"name":"Walkways & Trails","code":1,"color":"#db813f"}]},"editable":true,"nullable":false},"dual_fac_type":{"name":"dual_fac_type","type":"esriFieldTypeSmallInteger","alias":"Facility Type","domain":{"type":"codedValue","name":"dual_fac_type","codedValues":[{"name":"Multi-Use Path","code":5,"color":"#275f68"}]},"editable":true,"nullable":false},"landline_regional_greenways":{"name":"landline_regional_greenways","type":"esriFieldTypeSmallInteger","alias":"Facility Type","domain":{"type":"codedValue","name":"landline_regional_greenways","codedValues":[{"name":"Regional Land Lines","code":false,"color":"#FFCC00"}]},"editable":true,"nullable":false}},"name":"trailmap","version":"0.0.0+db8cb5c8"});
}

/* jshint ignore:end */
//# sourceMappingURL=trailmap.map
