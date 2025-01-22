// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import React, {useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import InfoPanel from './panel';
import {normalizeParam} from './format-utils';
import {MAPBOX_STYLES} from './defaults';

const DemoContainer = styled.div`
  height: 100%;
  .tooltip,
  .deck-tooltip {
    position: absolute;
    padding: 4px 12px;
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    max-width: 300px;
    font-size: 12px;
    z-index: 9;
    pointer-events: none;
    white-space: nowrap;
  }
`;

const MapTip = styled.div`
  position: absolute;
  right: 12px;
  bottom: 20px;
  color: #ffffff;
  mix-blend-mode: difference;
  font-size: 14px;

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

export default function makeExample(DemoComponent, {isInteractive = true, style} = {}) {
  const {parameters = {}, mapStyle} = DemoComponent;
  const defaultParams = Object.keys(parameters).reduce((acc, name) => {
    acc[name] = normalizeParam(parameters[name]);
    return acc;
  }, {});

  return function () {
    const [params, setParams] = useState(defaultParams);
    const [meta, setMeta] = useState({});

    const useParam = useCallback(newParameters => {
      const newParams = Object.keys(newParameters).reduce((acc, name) => {
        acc[name] = normalizeParam(newParameters[name]);
        return acc;
      }, {});
      setParams(p => ({...p, ...newParams}));
    }, []);

    const updateMeta = useCallback(newMeta => {
      setMeta(m => ({...m, ...newMeta}));
    }, []);

    useEffect(() => {
      let source = DemoComponent.data;
      if (!source) {
        return;
      }

      const isArray = Array.isArray(source);

      if (!isArray) {
        source = [source];
      }
      
    }, []);

    const updateParam = (name, value) => {
      const p = params[name];
      if (p) {
        setParams({
          ...params,
          [name]: normalizeParam({...p, value})
        });
      }
    };

    return (
      <DemoContainer style={style}>
        <DemoComponent
          mapStyle={mapStyle || MAPBOX_STYLES.BLANK}
          params={params}
          useParam={useParam}
          onStateChange={updateMeta}
        />
        {isInteractive && (
          <InfoPanel
            title={DemoComponent.title}
            params={params}
            meta={meta}
            updateParam={updateParam}
            sourceLink={DemoComponent.code}
          >
            {DemoComponent.renderInfo(meta)}
          </InfoPanel>
        )}

        {isInteractive && mapStyle && <MapTip>Hold down shift to rotate</MapTip>}
      </DemoContainer>
    );
  };
}
