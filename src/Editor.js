import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { getCookie, setCookie } from './utils.js';
import { SearchBox } from "@mapbox/search-js-react";
import { accessToken } from './token.js';
import './Editor.css';
export default function Editor({ setGlobalMode, globalMode, setImageId, imageId, mapOptions, setMapOptions }) {

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(mapOptions.lng);
  const [lat, setLat] = useState(mapOptions.lat);
  const [zoom, setZoom] = useState(mapOptions.zoom);
  const [bearing, setBearing] = useState(mapOptions.bearing);
  const [inputValue, setInputValue] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [mode, setMode] = useState(getCookie('mode', 'map'));
  const [filters, setFilters] = useState(getCookie('filters', []));
  const [filterValue, setFilterValue] = useState("");
  const [showHelp, setShowHelp] = useState(getCookie('showhelp', 1));
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("-");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [focusedTitle, setFocusedTitle] = React.useState(false)
  const onFocusTitle = () => setFocusedTitle(true)
  const onBlurTitle = () => setFocusedTitle(false)
  const [focusedDesc, setFocusedDesc] = React.useState(false)
  const onFocusDesc = () => setFocusedDesc(true)
  const onBlurDesc = () => setFocusedDesc(false)

  const availableFilters = new Map([
    ["brightness", [50, 0, 300, "%"]],
    ["contrast", [150, 0, 300, "%"]],
    ["grayscale", [50, 0, 100, "%"]],
    ["saturate", [150, 0, 300, "%"]],
    ["invert", [100, 0, 100, "%"]],
    ["sepia", [50, 0, 100, "%"]],
    ["blur", [2, 0, 100, "px"]],
    ["hue-rotate", [50, 0, 360, "deg"]],
    ["opacity", [50, 0, 100, "%"]]
  ]);
  const gridLines = [16.66, 33.33, 50, 66.66, 83.33];

  const toggleControls = () => {
    setShowControls((showControls) => !showControls);
  }

  const toggleGrid = () => {
    setShowGrid((showGrid) => !showGrid);
  }

  const toggleLayer = () => {
    if (map.current) {
      map.current.setStyle(map.current.style.globalId === 'mapbox://styles/mapbox/satellite-v9' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/satellite-v9');
    }
  }

  const handleKeyDown = (e) => {
    //    console.log(e);
    if (e.ctrlKey && !e.altKey && !e.shiftKey) {
      switch (e.code) {
        case "Space":
          toggleControls();
          break;
        case "ArrowLeft":
          map.current.setBearing(map.current.getBearing() - .1);
          break;
        case "ArrowRight":
          map.current.setBearing(map.current.getBearing() + .1);
          break;
        case "ArrowUp":
          map.current.setZoom(map.current.getZoom() * 1.001);
          break;
        case "ArrowDown":
          map.current.setZoom(map.current.getZoom() / 1.001);
          break;
        default:
          break;
      }
    } else if (!e.ctrlKey && !e.altKey && e.shiftKey) {
      switch (e.code) {
        case "ArrowLeft":
          map.current.setBearing(map.current.getBearing() - 5);
          break;
        case "ArrowRight":
          map.current.setBearing(map.current.getBearing() + 5);
          break;
        case "ArrowUp":
          map.current.setZoom(map.current.getZoom() * 1.01);
          break;
        case "ArrowDown":
          map.current.setZoom(map.current.getZoom() / 1.01);
          break;
        default:
          break;
      }
    }
  };

  const drawImage = () => {
    if (map.current) {
      var canvas = document.querySelector("#editorCanvas");
      canvas.width = map.current.getCanvas().width;
      canvas.height = map.current.getCanvas().height;
      const ctx = canvas.getContext("2d");
      ctx.filter = filters.map((e) => e.filter + "(" + e.value + e.units + ")").join(" ");
      ctx.drawImage(map.current.getCanvas(), 0, 0);
    }
  }

  const handleCreateClick = () => {
    setMode('editor');
    drawImage();
  }

  const handleMapClick = () => {
    setMode('map');
  }

  const handleCompassClick = () => {
    map.current.setBearing(0);
  }

  const handleFilterSelect = (e) => {
    setFilterValue("");
    setFilters([...filters, {
      id: crypto.randomUUID(),
      filter: e.target.value,
      value: availableFilters.get(e.target.value)[0],
      minValue: availableFilters.get(e.target.value)[1],
      maxValue: availableFilters.get(e.target.value)[2],
      units: availableFilters.get(e.target.value)[3]
    }]);
  }

  const handleFilterValueChange = (e) => {
    let newFilters = filters.slice();
    var foundIndex = newFilters.findIndex(x => x.id === e.target.id);
    newFilters[foundIndex].value = e.target.value;
    setFilters(newFilters);
  }

  const handleDeleteButtonClick = (e) => {
    console.log(e.target.id);
    let newFilters = filters.slice();
    var foundIndex = newFilters.findIndex(x => x.id === e.target.id);
    newFilters.splice(foundIndex, 1);
    setFilters(newFilters);
  }

  const handleDownloadClick = () => {
    var canvas = document.querySelector("#editorCanvas");
    var img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var a = document.querySelector('.image-link');
    let filename = "mapart_" + Date.now() + ".png";
    a.download = filename;
    a.href = img;
    a.click();
  }

  const handleCloseHelpClick = () => {
    setShowHelp(0);
    setCookie('showhelp', 0);
  }

  const handleHelpClick = () => {
    setShowHelp(1);
  }

  const handleGridClick = () => {
    toggleGrid();
  }

  const handleLayerClick = () => {
    toggleLayer();
  }

  const handleUploadClick = () => {

    if (title.trim() === "") {
      setTitle("");
      document.querySelector(".image-title").focus();
      return;
    } 
    // else if (desc.trim() === "") {
    //   setDesc("");
    //   document.querySelector(".image-description").focus();
    //   return;
    // }

    let canvas = document.querySelector("#editorCanvas");
    canvas.toBlob(function (blob) {
      let o = {};
      o.user_id = 1;
      o.title = title;
      o.desc = desc;
      o.width = canvas.width;
      o.height = canvas.height;
      o.lat = map.current.getCenter().lat;
      o.lng = map.current.getCenter().lng;
      o.zoom = map.current.getZoom();
      o.bearing = map.current.getBearing();
      o.filters = filters.map((e) => e.filter + "(" + e.value + e.units + ")").join(" ");
      const formData = new FormData();
      formData.append('filedata', blob, encodeURI(JSON.stringify(o)));
      fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData
      })
        .then((response) => response.text())
        .then((resp) => {
          let r = JSON.parse(resp);
          if (r.result === "ok") {
            setToastText("Image Uploaded");
            setShowToast(true);
            console.log(r.id);
            setTimeout(() => {
              setShowToast(false);
              setGlobalMode("gallery");
            }, 3000);
            setImageId(r.id);
          }
        });
    }, 'image/jpeg');
  }

  const handleGalleryClick = () => {
    setImageId(undefined);
    setGlobalMode("gallery");
  }

  useEffect(() => {
    drawImage();
  }, [filters]);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    document.addEventListener("keydown", handleKeyDown, true);

    mapboxgl.accessToken = accessToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      // center: [lng, lat],
      center: [mapOptions.lng, mapOptions.lat],
      zoom: zoom,
      bearing: bearing,
      preserveDrawingBuffer: true,
      // pitch: 60,
      bearingSnap: 0
    });

    map.current.touchZoomRotate.disableRotation();
    map.current.dragRotate.disable();
    map.current.keyboard.disableRotation();

    /*
        if (showControls) {
          map.current.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body') }), 'top-right');
          map.current.addControl(new mapboxgl.NavigationControl());
        }
    */
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng);
      setLat(map.current.getCenter().lat);
      setZoom(map.current.getZoom());
      setBearing(map.current.getBearing());
      setCookie('lat', map.current.getCenter().lat);
      setCookie('lng', map.current.getCenter().lng);
      setCookie('zoom', map.current.getZoom());
      setCookie('bearing', map.current.getBearing());
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

  });

  return (
    <>
      <div className='map-wrapper'>
        {showControls && <SearchBox
          accessToken={accessToken}
          map={map.current}
          mapboxgl={mapboxgl}
          value={inputValue}
          onChange={(d) => {
            setInputValue(d);
          }}
        />}
        {<div ref={mapContainer} className="map-container" />}

        {showControls && <div className='controlbar top-right'>
          {mode === 'map' && <>
            <button className='map-button icon-compass' onClick={handleCompassClick} title='Set north' />
            <button className='map-button icon-grid' onClick={handleGridClick} title='Show gridlines' />
            <button className='map-button icon-label' onClick={handleLayerClick} title='Toggle labels' />
            <button className='map-button icon-edit' onClick={handleCreateClick} title='Edit & publish' />
            <button className='map-button icon-gallery' onClick={handleGalleryClick} title='Open gallery' />
          </>}
          {mode === 'editor' && <>
            <button className='map-button icon-upload' onClick={handleUploadClick} title='Upload to gallery' />
            <button className='map-button icon-globe' onClick={handleMapClick} title='Go to map' />
          </>}

        </div>}

        {showControls && <div className='controlbar bottom-right'>
          <button className='map-button icon-help' onClick={handleHelpClick} title='Show help' />
        </div>}

        {showControls && <div className="sidebar">Longitude: {parseFloat(lng).toFixed(4)} | Latitude: {parseFloat(lat).toFixed(4)} | Zoom: {parseFloat(zoom).toFixed(2)} | Bearing: {parseFloat(bearing).toFixed(2)}</div>}

        {showControls && showGrid && <div className='grid-container'>
          {gridLines.map((x) => <>
            <div key={`x1`} className='grid grid-v' style={{ 'left': `${x}%` }}></div>
            <div key={`x2`} className='grid grid-h' style={{ 'top': `${x}%` }}></div>
          </>)}
        </div>}
        {<div className='editor' style={{ visibility: mode === 'editor' ? 'visible' : 'hidden' }}>
          <canvas id="editorCanvas" />

          {false && <button className='map-button icon-download' onClick={handleDownloadClick} />}

          {/* <a className='image-link'></a> */}

          {showControls && <div className='controlbar top'>
            <span className='input-wrapper'>
              <input className='image-title' type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} onFocus={onFocusTitle} onBlur={onBlurTitle} />
              {title === "" && focusedTitle && <p className='hint-bubble'>Please specify title</p>}
            </span>
          </div>}

          {/* <div className='image-info'>
            <span className='input-wrapper'>
              <input className='image-title' type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} onFocus={onFocusTitle} onBlur={onBlurTitle} />
              {title === "" && focusedTitle && <p className='hint-bubble'>Please specify title</p>}
            </span>
            <span className='input-wrapper'>
              <textarea className='image-description' placeholder='Description' value={desc} onChange={(e) => setDesc(e.target.value)} onFocus={onFocusDesc} onBlur={onBlurDesc} />
              {desc === "" && focusedDesc && <p className='hint-bubble'>Please specify description</p>}
            </span>
          </div> */}

          <div className='filters'>
            <select className='filter' name="cars" id="cars" value={filterValue} onChange={handleFilterSelect}>
              <option value="" disabled>Add filter</option>
              {Array.from(availableFilters).map(([key, value]) => <option key={key} value={key}>{key}</option>)}
            </select>
            <ul className='filter-list'>{filters.map((e, i) =>
              <li key={"li_" + e.id} id={"li_" + e.id}>
                <input type="range" min={e.minValue} max={e.maxValue} defaultValue={e.value} className="slider" id={e.id} onChange={handleFilterValueChange} />
                <span className='filter-value'>{e.filter} ({e.value} {e.units})</span>
                <button id={e.id} className='filter-button icon-delete' onClick={handleDeleteButtonClick} />
              </li>
            )}</ul>
          </div>
        </div>}
      </div>
      {showHelp === 1 &&
        <div className='bg'>
          <div className='help'>
            <span>Drag, zoom and rotate the map to get an interesting perspective</span>
            <span>Click "Edit" to add filters and publish your art</span>
            <span>Hotkeys:</span>
            <span>Move map: <h1>↑</h1><h1>↓</h1><h1>←</h1><h1>→</h1></span>
            <span>Zoom map: <h1>+</h1><h1>-</h1></span>
            <span>Zoom map (small): <h1>Shift ↑</h1><h1>Shift ↓</h1></span>
            <span>Zoom map (micro): <h1>Ctrl ↑</h1><h1>Ctrl ↓</h1></span>
            <span>Rotate map (small): <h1>Shift ←</h1><h1>Shift →</h1></span>
            <span>Rotate map (micro): <h1>Ctrl ←</h1><h1>Ctrl →</h1></span>
            <button className='gotit' onClick={handleCloseHelpClick}>Got it!</button>
          </div>
        </div>
      }

      {showToast && <div className='toast'>{toastText}</div>}
    </>
  );
}
