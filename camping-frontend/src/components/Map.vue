<template>
    <div id="app">
      <div id="map" class="map-container"></div>
    </div>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
  
  export default {
    name: 'MapComponent',
    data() {
      return {
        map: null,
        geocoder: null,
        searchResult: null
      };
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        mapboxgl.accessToken = 'pk.eyJ1IjoibGVvbmdpdG9uZSIsImEiOiJjbHhoemRubGwxYnUyMmtxenozNHBmMHFxIn0.To2MTF_jHO9j8ozhqkg3UA'; // Replace with your Mapbox access token
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-79.4512, 43.6568], // Initial map center
          zoom: 13 // Initial zoom level
        });
  
        this.geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl
        });
  
        this.geocoder.on('result', this.handleResult);
  
        this.map.addControl(this.geocoder);
      },
      handleResult(event) {
        this.searchResult = event.result;
        const name = event.result.place_name;
      const coordinates = event.result.geometry.coordinates;
      const latitude = coordinates[1].toString(); // Latitude as string
      const longitude = coordinates[0].toString(); // Longitude as string
      this.$emit('locationSelected', { address: name, coordinates: [latitude, longitude] });
      }
    }
  };
  </script>
  
  <style scoped>
  body {
    margin: 0;
    padding: 0;
  }
  #map {
    position: absolute;
    width: 50%;
    height: 40vh;
  }
  </style>
  