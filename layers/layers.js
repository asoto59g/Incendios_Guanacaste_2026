var wms_layers = [];


        var lyr_GoogleHybrid_0 = new ol.layer.Tile({
            'title': 'Google Hybrid',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: '&nbsp;&middot; <a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',
                url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            })
        });
var lyr_incendios_1 = new ol.layer.Image({
        opacity: 1,
        
    title: 'incendios<br />\
    <img src="styles/legend/incendios_1_0.png" /> 0<br />\
    <img src="styles/legend/incendios_1_1.png" /> 1<br />\
    <img src="styles/legend/incendios_1_2.png" /> 2<br />\
    <img src="styles/legend/incendios_1_3.png" /> 3<br />\
    <img src="styles/legend/incendios_1_4.png" /> 4<br />\
    <img src="styles/legend/incendios_1_5.png" /> 5<br />\
    <img src="styles/legend/incendios_1_6.png" /> 6<br />\
    <img src="styles/legend/incendios_1_7.png" /> 7<br />\
    <img src="styles/legend/incendios_1_8.png" /> 8<br />' ,
        
        
        source: new ol.source.ImageStatic({
            url: "./layers/incendios_1.png",
            attributions: ' ',
            projection: 'EPSG:3857',
            alwaysInRange: true,
            imageExtent: [-9571150.000000, 1116894.809211, -9468860.000000, 1257039.675832]
        })
    });
var lyr_PropietariosZona2_2 = new ol.layer.Tile({
                            source: new ol.source.TileWMS(({
                              url: "https://siri.snitcr.go.cr/Geoservicios/wms?request%3DGetCapabilities",
                              attributions: ' ',
                              params: {
                                "LAYERS": "catastro_aldia",
                                "TILED": "true",
                                "VERSION": "1.1.1"},
                            })),
                            title: 'Propietarios Zona 2',
                            popuplayertitle: 'Propietarios Zona 2',
                            type: '',
                            opacity: 1.000000,
                            
                            
                          });
              wms_layers.push([lyr_PropietariosZona2_2, 0]);
var lyr_PropietariosZona1_3 = new ol.layer.Tile({
                            source: new ol.source.TileWMS(({
                              url: "https://siri.snitcr.go.cr/Geoservicios/wms?request%3DGetCapabilities",
                              attributions: ' ',
                              params: {
                                "LAYERS": "catastro",
                                "TILED": "true",
                                "VERSION": "1.1.1"},
                            })),
                            title: 'Propietarios Zona 1',
                            popuplayertitle: 'Propietarios Zona 1',
                            type: '',
                            opacity: 1.000000,
                            
                            
                          });
              wms_layers.push([lyr_PropietariosZona1_3, 0]);

lyr_GoogleHybrid_0.setVisible(true);lyr_incendios_1.setVisible(true);lyr_PropietariosZona2_2.setVisible(true);lyr_PropietariosZona1_3.setVisible(true);
var layersList = [lyr_GoogleHybrid_0,lyr_incendios_1,lyr_PropietariosZona2_2,lyr_PropietariosZona1_3];
