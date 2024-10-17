import React, { useRef, useEffect, useState } from 'react';
import { getCookie, setCookie } from './utils.js';
import './Gallery.css';

export default function Gallery() {

    const [images, setImages] = useState([]);
    const [imageId, setImageId] = useState(getCookie("image_id"));
    const [imageIdx, setImageIdx] = useState(-1);

    const handleMapClick = () => {
        setCookie('mode', 'map');
        document.location.reload();
    }

    const handleImageClick = (e) => {
        let i = images.findIndex((x) => x.id == e.target.id);
        setImageIdx(i);
    }

    const handleCloseImageClick = () => {
        setImageIdx(undefined);
    }

    const handleWheel = (e) => {
        if (e.deltaY < 0 && imageIdx > 0)
            setImageIdx(imageIdx - 1);
        else if (e.deltaY > 0 && imageIdx < images.length - 1) {
            setImageIdx(imageIdx + 1);
        }
    }

    useEffect(() => {
        fetch('http://localhost:3001/images', {
            method: 'GET'
        })
            .then((response) => response.text())
            .then((resp) => {
                // console.log(resp);
                let r = JSON.parse(resp);
                setImages(r);
                let idx = r.findIndex((x) => x.id == imageId);
                setImageIdx(idx);
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
                {images.map((x) => <div key={'d1' + x.id} className='gal-img-wrap'>
                    <img id={x.id} key={x.id} className='gal-image' src={x.thumbnail} onClick={handleImageClick} title={"<p>" + x.title + "</p><p>" + x.desc + "</p>"} />
                    <div key={'d2' + x.id} className='gal-title'>{x.title}</div>
                </div>

                )}
            </div>
            {(imageIdx !== undefined && imageIdx > -1 && images.length > 0) &&
                <div className='image-open' onClick={handleCloseImageClick} onWheel={handleWheel}>
                    <div className='gal-img-wrap-open' style={{ backgroundImage: `url(${'uploads/' + images[imageIdx].filename})` }}>
                        <p className='gal-title-open'>{images[imageIdx].title}</p>
                        <p className='gal-desc-open'>{images[imageIdx].desc}</p>
                        <div className='likes'>
                            <button className='map-button icon-like' onClick={e => { console.log("like"); e.stopPropagation(); }} />
                            <p>{images[imageIdx].likes}</p>
                            <button className='map-button icon-dislike' onClick={e => { console.log("dislike"); e.stopPropagation(); }} />
                        </div>
                    </div>
                </div>}
        </>
    )
}
