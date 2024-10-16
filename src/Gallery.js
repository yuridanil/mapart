import React, { useRef, useEffect, useState } from 'react';
import { getCookie, setCookie } from './utils.js';
import './Gallery.css';

export default function Gallery() {

    const [images, setImages] = useState([]);
    const [imageId, setImageId] = useState(getCookie("image_id"));
    const [imageTitle, setImageTitle] = useState("");

    const handleMapClick = () => {
        setCookie('mode', 'map');
        document.location.reload();
    }

    const handleImageClick = (e) => {
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
        <>
            <div className='gal-header'>
                <button className='map-button icon-globe' onClick={handleMapClick} />
            </div>
            <div className='gal-content'>
                {images.map((x) => <div className='gal-img-wrap'>
                    <img id={x.filename} key={x.id} className='gal-image' src={x.thumbnail} onClick={handleImageClick} />
                    <div className='gal-title'>{x.title}</div>
                </div>

                )}
            </div>
            {imageId !== undefined &&
                <div className='image-open' onClick={handleCloseImageClick}>
                    <img className='gal-image-open' src={'uploads/' + imageId} />
                    <div className='gal-title'>{imageTitle}</div>
                </div>}
        </>
    )
}