import React, { useRef, useEffect, useState } from 'react';
import { getCookie, setCookie } from './utils.js';
import './Gallery.css';

export default function Gallery() {

    const [images, setImages] = useState([]);
    const [imageId, setImageId] = useState(getCookie("image_id"));

    const handleClick = () => {
        setCookie('mode', 'map');
        document.location.reload();
    }

    const handleImageClick = (e) => {
        console.log(e);
        setImageId(e.target.id);
    }

    const handleCloseImageClick = () => {
        setImageId(undefined);
    }

    useEffect(() => {
        fetch('http://localhost:3001/images', {
            method: 'GET'
        })
            .then((response) => response.text())
            .then((resp) => {
                console.log(resp);
                let r = JSON.parse(resp);
                setImages(r);
                // if (r.result === "ok") {

                // }
            });

    }, [])

    return (
        <><div><button onClick={handleClick}>Return</button></div>
            <div className='image-gallery'>
                {images.map((x) =>
                    <img id={x.filename} key={x.id} className='gal-image' src={x.thumbnail} onClick={handleImageClick} />
                )}
            </div>
            {imageId !== undefined && <div className='image-open' onClick={handleCloseImageClick}><img className='gal-image-open' src={'uploads/' + imageId} /></div>}
        </>
    )
}