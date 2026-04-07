import React, { useEffect, useState } from 'react';
import './Gallery.css';

export default function Gallery({ setGlobalMode, globalMode, setImageId, imageId, mapOptions, setMapOptions }) {
    const [images, setImages] = useState([]);
    const [imageIdx, setImageIdx] = useState(-1);

    const handleMapClick = () => {
        setGlobalMode("map");
    }

    const handleOpenImageClick = (id) => {
        // let i = images.findIndex((x) => x.id === parseInt(e.target.id));
        console.log(id);
        setImageIdx(parseInt(id));
    }

    const handleCloseImageClick = () => {
        setImageIdx(-1);
    }

    const prevImage = () => {
        if (imageIdx > 0) {
            setImageIdx(imageIdx - 1);
        }
    }

    const nextImage = () => {
        if (imageIdx < images.length - 1)
            setImageIdx(imageIdx + 1);
    }

    const handleWheel = (e) => {
        if (e.deltaY < 0)
            prevImage();
        else if (e.deltaY > 0)
            nextImage();
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            // console.log(e);
            if (imageIdx !== undefined) {
                switch (e.key) {
                    case "ArrowRight":
                    case "PageDown":
                        nextImage();
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                    case "ArrowLeft":
                    case "PageUp":
                        prevImage();
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                    case "Escape":
                        handleCloseImageClick();
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

    }, [imageIdx]);

    useEffect(() => {
        console.log(imageId);
        fetch('http://localhost:8080/images', {
            method: 'GET'
        })
            .then((response) => response.text())
            .then((resp) => {
                console.log(resp);
                let r = JSON.parse(resp);
                setImages(r);
                let idx = r.findIndex((x) => x.id === imageId);
                setImageIdx(idx);
                // if (r.result === "ok") {

                // }
            });

    }, [])

    return (
        <>
            <div className='controlbar top-right'>
                <button className='map-button icon-globe' onClick={handleMapClick} title='Open map' />
            </div>
            <div className='gal-content'>
                {images.map((x, idx) => <div key={'d1' + x.id} className='gal-img-wrap'>
                    <img id={x.id} key={x.id} className='gal-image' src={`http://localhost:8080/image?t=1&id=${x.id}`} onClick={() => handleOpenImageClick(idx)} title={"<p>" + x.title + "</p><p>" + x.desc + "</p>"} alt={x.title} />
                    <div key={'d2' + x.id} className='gal-title'>{x.title || 'Untitled'}</div>
                </div>
                )}
            </div>
            {(imageIdx > -1) &&
                <div className='image-open' onClick={handleCloseImageClick} onWheel={handleWheel}>
                    <div className='gal-img-wrap-open' style={{ backgroundImage: `url(http://localhost:8080/image?id=${images[imageIdx].id}` }}>
                        <p className='gal-title-open' onClick={e => {
                            setMapOptions({ lat: images[imageIdx].lat, lng: images[imageIdx].lng, zoom: images[imageIdx].zoom, bearing: images[imageIdx].bearing });
                            e.stopPropagation();
                            setGlobalMode("map");
                        }}>{images[imageIdx].title || 'Untitled'}</p>
                        { false &&<p className='gal-desc-open'>{images[imageIdx].desc || 'Undescribed'}</p> }
                        <div className='likes'>
                            <button className='map-button icon-like' onClick={e => { console.log("dislike"); e.stopPropagation(); }} />
                            <p>{images[imageIdx].likes}</p>
                            <button className='map-button icon-dislike' onClick={e => { console.log("dislike"); e.stopPropagation(); }} />
                        </div>
                    </div>
                </div>}
        </>
    )
}
