import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import type BaseLayer from 'ol/layer/Base'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Snap from 'ol/interaction/Snap'
import type { MultiPolygon } from 'ol/geom'
import { Projection } from 'ol/proj'
import dummyData from '@/data/example.json'

interface Event<T = EventTarget> {
  target: T
}

export const useBaseMapStore = defineStore('baseMap', () => {
  const map = ref<Map>()
  const baseMap = ref('osm')
  const vectorLayer = ref()

  function initializeMap() {
    map.value = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    })

    addVectorLayer()
  }

  function removeAllLayer() {
    if (!map.value) return
    map.value.getLayers().forEach((layer: BaseLayer) => {
      map.value?.removeLayer(layer)
    })
  }

  function addGoogleBaseMap() {
    if (!map.value) return

    const layer: BaseLayer = new TileLayer({
      source: new XYZ({
        url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
      })
    })
    map.value.addLayer(layer)
  }

  function addOsmBaseMap() {
    if (!map.value) return
    map.value.addLayer(
      new TileLayer({
        source: new OSM()
      })
    )
  }

  function addEsriBaseMap() {
    if (!map.value) return
    const layer: BaseLayer = new TileLayer({
      source: new XYZ({
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/' +
          'World_Street_Map/MapServer/tile/{z}/{y}/{x}'
      })
    })

    map.value.addLayer(layer)
  }

  function addVectorLayer() {
    if (!map.value) return

    const projection = new Projection({
      code: 'EPSG:3857'
    })

    const source = new VectorSource({
      features: new GeoJSON().readFeatures(dummyData, { featureProjection: projection })
    })

    const polygon = source.getFeatures()[0].getGeometry() as MultiPolygon
    const coordinates = polygon.getFirstCoordinate()

    const vector = new VectorLayer({
      source: source,
      zIndex: 2,
      style: new Style({
        fill: new Fill({
          color: '#bed4c0'
        }),
        stroke: new Stroke({
          color: '#5a8a5e',
          width: 1
        })
      })
    })

    vectorLayer.value = vector

    map.value.addLayer(vector)
    if (coordinates && coordinates.length > 0) {
      map.value.getView().setCenter(coordinates)
      map.value.getView().setZoom(6)
    }

    map.value.on('click', function (evt) {
      source
        .getFeaturesAtCoordinate(evt.coordinate)
        .forEach((layer) => console.log(layer.getProperties()))
    })
  }

  function uploadGeojsonFile(event: Event<HTMLInputElement>) {
    if (!event.target.files) return
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = readSuccess
    function readSuccess() {}

    if (file) {
      reader.readAsText(file)
    }
  }

  watch(baseMap, (baseMap) => {
    removeAllLayer()

    if (baseMap === 'google') {
      addGoogleBaseMap()
    } else if (baseMap === 'osm') {
      addOsmBaseMap()
    } else {
      addEsriBaseMap()
    }
  })

  return { map, baseMap, initializeMap, uploadGeojsonFile }
})
