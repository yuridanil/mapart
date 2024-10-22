import React, { useRef, useEffect, useState, useSearchParams } from 'react';
import Editor from './Editor';
import Gallery from './Gallery';
import { getCookie, setCookie } from './utils.js';

export default function App2() {
  const [mode, setMode] = useState('gallery');
  const [imageId, setImageId] = useState(undefined);
  const [mapOptions, setMapOptions] = useState({
    lng: getCookie('lng', -118.40846694274578),
    lat: getCookie('lat', 33.93743834974455),
    zoom: getCookie('zoom', 18.715823602858986),
    bearing: getCookie('bearing', -6.999999999999318)
  });

  return (
    <>
      {(mode === "map" || mode === "editor") && <Editor setGlobalMode={setMode} globalMode={mode} setImageId={setImageId} imageId={imageId} mapOptions={mapOptions} setMapOptions={setMapOptions}/>}
      {mode === "gallery" && <Gallery setGlobalMode={setMode} globalMode={mode} setImageId={setImageId} imageId={imageId}  mapOptions={mapOptions} setMapOptions={setMapOptions}/>}
    </>
  );
}
