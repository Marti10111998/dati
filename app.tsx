import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

import type { MapViewState } from '@deck.gl/core';

// Path to your remote data file
const REMOTE_DATA_URL = 'https://raw.githubusercontent.com/Marti10111998/dati/refs/heads/main/transformed_data.json';

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 9.19, // Longitude for Milan
  latitude: 45.486, // Latitude for Milan
  zoom: 12, // Adjusted zoom level to focus on Milan
  maxZoom: 16,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

type DataPoint = [longitude: number, latitude: number, count?: number];

export default function App({
  intensity = 1,
  threshold = 0.03,
  radiusPixels = 30,
  mapStyle = MAP_STYLE,
}: {
  intensity?: number;
  threshold?: number;
  radiusPixels?: number;
  mapStyle?: string;
}) {
  const [data, setData] = useState<DataPoint[]>([]);

  // Fetch data from the remote JSON file
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(REMOTE_DATA_URL);
        const rawData = await response.json();

        // Transform data to [longitude, latitude, count]
        const formattedData: DataPoint[] = rawData.map((item: any) => [
          item.COORDINATES[0], // Longitude
          item.COORDINATES[1], // Latitude
          item.RACKS || 1,     // Count or default to 1
        ]);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    }

    fetchData();
  }, []);

  const layers = [
    new HeatmapLayer<DataPoint>({
      data,
      id: 'heatmap-layer',
      pickable: false,
      getPosition: d => [d[0], d[1]],
      getWeight: d => d[2] || 1, // Use weight if available, otherwise default to 1
      radiusPixels,
      intensity,
      threshold,
    }),
  ];

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers}>
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
  );
}

export function renderToDOM(container: HTMLDivElement) {
  createRoot(container).render(<App />);
}
