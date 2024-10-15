import React, { useRef, useEffect, useState, useSearchParams } from 'react';
import Editor from './Editor';
import Gallery from './Gallery';
import { getCookie, setCookie } from './utils.js';

export default function App2() {
  const [mode, setMode] = useState(getCookie('mode', 'map'));
  return (
    <>
      {(mode === "map" || mode ==="editor" ) && <Editor />}
      {mode === "gallery" && <Gallery />}
    </>
  );
}
