import React, { useRef, useEffect, useState, useSearchParams } from 'react';
import Editor from './Editor';
import Gallery from './Gallery';
import { getCookie, setCookie } from './utils.js';

export default function App2() {
  const [mode, setMode] = useState('map');
  const [imageId, setImageId] = useState(undefined);
  return (
    <>
      {(mode === "map" || mode ==="editor" ) && <Editor setGlobalMode={setMode} globalMode={mode}/>}
      {mode === "gallery" && <Gallery  setGlobalMode={setMode} globalMode={mode}/>}
    </>
  );
}
