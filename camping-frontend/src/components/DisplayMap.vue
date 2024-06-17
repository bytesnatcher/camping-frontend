<template>
    <div>
      <div id="display-map" class="map-container"></div>
    </div>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  
  export default {
    name: 'DisplayMap',
    props: {
      coordinates: {
        type: Array,
        required: true
      }
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        // Convert string coordinates to numbers
        const latitude = parseFloat(this.coordinates[0]);
        const longitude = parseFloat(this.coordinates[1]);
  
        mapboxgl.accessToken = 'pk.eyJ1IjoibGVvbmdpdG9uZSIsImEiOiJjbHhoemRubGwxYnUyMmtxenozNHBmMHFxIn0.To2MTF_jHO9j8ozhqkg3UA'; // Replace with your Mapbox access token
        this.map = new mapboxgl.Map({
          container: 'display-map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [longitude, latitude], // Center map at given coordinates
          zoom: 13 // Initial zoom level
        });
  
        // Add a marker at the given coordinates
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(this.map);
      }
    }
  };
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 400px; /* Adjust height as needed */
    border: 1px solid #ccc; /* Add border for better visibility */
  }
  </style>
  