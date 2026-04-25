// ==========================
// AREA DE ESTUDIO
// ==========================

var cantones = [
  'LIBERIA',
  'LA CRUZ',
  'CARRILLO',
  'SANTA CRUZ',
  'BAGACES'
];

var area = ee.FeatureCollection("users/oasotob/CantonesCR")
  .filter(ee.Filter.inList('NCANTON', cantones));


Map.centerObject(area,10);
Map.setOptions('HYBRID');

// ==========================
// TITULO
// ==========================
Map.add(ui.Label({
  value: 'Incendios vs Cobertura - Liberia 2019–2026',
  style: {position: 'top-center', fontWeight: 'bold', fontSize: '18px'}
}));

// ==========================
// OPEN BUILDINGS
// ==========================
var buildings = ee.FeatureCollection('GOOGLE/Research/open-buildings/v3/polygons')
  .filterBounds(area);

var buildingsRaster = ee.Image(0).byte().paint(buildings, 1);
var maskNoBuildings = buildingsRaster.not();

// ==========================
// LAND COVER 2026
// ==========================
var img = ee.ImageCollection("COPERNICUS/S2")
  .filterDate('2026-02-25','2026-02-27')
  .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 10);

var mosaico = img.mosaic().clip(area);

var lc = ee.ImageCollection('ESA/WorldCover/v200').first();

var classValues = [10,20,30,40,50,60,70,80,90,95,100];
var remapValues = ee.List.sequence(1,11);

lc = lc.remap(classValues, remapValues).rename('lc').toByte();

// entrenamiento
var sample = mosaico.addBands(lc).stratifiedSample({
  numPoints: 5000,
  classBand: 'lc',
  region: area,
  scale: 10,
  geometries: true
});

sample = sample.randomColumn();

var classifier = ee.Classifier.smileRandomForest(4).train({
  features: sample.filter('random <= 0.8'),
  classProperty: 'lc',
  inputProperties: mosaico.bandNames()
});

var imgClassified = mosaico.classify(classifier);

// visual LC (apagado)
var paletteLC = [
  '006400','ffbb22','ffff4c','f096ff','fa0000',
  'b4b4b4','f0f0f0','0064c8','0096a0','00cf75','fae6a0'
];

Map.addLayer(imgClassified, {min:1,max:11,palette:paletteLC}, 'Land Cover', false);

// ==========================
// INCENDIOS 2019–2026
// ==========================
var acumulado = ee.Image(0);

ee.List.sequence(2019,2026).getInfo().forEach(function(anio){

  var col = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(area)
    .filterDate(ee.Date.fromYMD(anio,4,15), ee.Date.fromYMD(anio,5,15))
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',40));

  if (col.size().getInfo() === 0) return;

  var img = col.median();
  var nbr = img.normalizedDifference(['B8','B12']);

  var quemado = nbr.lt(-0.1).selfMask().unmask(0);
  quemado = quemado.updateMask(maskNoBuildings);

  acumulado = acumulado.add(quemado);
});

// máscara final
var acumuladoMask = acumulado
  .updateMask(acumulado.gt(1))
  .updateMask(maskNoBuildings);

// visualizar (única capa encendida)
Map.addLayer(acumuladoMask, {
  min:2, max:8,
  palette:['fcbba1','fc9272','fb6a4a','de2d26','a50f15']
}, 'Incendios acumulados', true);

// ==========================
// CRUCE
// ==========================
var fireOnLandcover = imgClassified.updateMask(acumuladoMask);
Map.addLayer(fireOnLandcover, {min:1,max:11,palette:paletteLC}, 'Incendios por cobertura', false);

// ==========================
// AREA QUEMADA
// ==========================
var areaImage = ee.Image.pixelArea()
  .updateMask(acumuladoMask)
  .addBands(imgClassified);

var stats = areaImage.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField:1,
    groupName:'lc'
  }),
  geometry: area,
  scale:10,
  maxPixels:1e13
});

print('Área quemada', stats);

// ==========================
// EXPORTACIONES (COG)
// ==========================

// 🔴 incendios
Export.image.toDrive({
  image: acumuladoMask.clip(area),
  description: 'incendios_acumulados',
  folder: 'GEE_Liberia',
  fileNamePrefix: 'incendios',
  region: area.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF',
  formatOptions: {cloudOptimized: true}
});

// 🌱 landcover
Export.image.toDrive({
  image: imgClassified.clip(area),
  description: 'landcover_2026',
  folder: 'GEE_Liberia',
  fileNamePrefix: 'landcover',
  region: area.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF',
  formatOptions: {cloudOptimized: true}
});

// 🔗 cruce
Export.image.toDrive({
  image: fireOnLandcover.clip(area),
  description: 'fire_landcover',
  folder: 'GEE_Liberia',
  fileNamePrefix: 'fire_lc',
  region: area.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF',
  formatOptions: {cloudOptimized: true}
});