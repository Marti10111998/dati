// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import React, {Component} from 'react';
import {readableInteger} from './format-utils';
import {MAPBOX_STYLES, DATA_URI, GITHUB_TREE} from './defaults';
import App from './app';

import makeExample from './make-example';

class HeatmapDemo extends Component {
  static title = 'Uber Pickup Locations In NewYork City';
  static code = `${GITHUB_TREE}/examples/website/heatmap`;

  static parameters = {
    radius: {displayName: 'Radius', type: 'range', value: 30, step: 1, min: 1, max: 50},
    intensity: {displayName: 'Intensity', type: 'range', value: 1, step: 0.1, min: 0, max: 5},
    threshold: {displayName: 'Threshold', type: 'range', value: 0.03, step: 0.01, min: 0, max: 1}
  };

  static mapStyle = MAPBOX_STYLES.DARK;

  static renderInfo(meta) {
    return (
      <div>
        <p>Pickup locations form April to September 2014.</p>
        <div>
          <img
            src="./color.png"
            alt="color scale"
            style={{height: 8, width: '100%'}}
          />
        </div>
        <p className="layout">
          <span className="col-1-2">Fewer</span>
          <span className="col-1-2 text-right">More</span>
        </p>
        <p>
          Data source:{' '}
          <a href="https://github.com/fivethirtyeight/uber-tlc-foil-response">
            Uber TLC FOIL Response
          </a>
        </p>
        {/* <div className="stat">
          No. of Samples
          <b>{readableInteger(meta.count || 0)}</b>
        </div> */}
      </div>
    );
  }

  render() {
    const {params, data} = this.props;
    const radiusPixels = params.radius.value;
    const intensity = params.intensity.value;
    const threshold = params.threshold.value;

    return (
      <App
        {...this.props}
        intensity={intensity}
        threshold={threshold}
        radiusPixels={radiusPixels}
      />
    );
  }
}

export default makeExample(HeatmapDemo);
