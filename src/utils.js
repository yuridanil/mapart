export function downloadImage() {
    console.log('download');

}

export function downloadImage2() {
    console.log('download');

}

export function setCookie(name, value) {
    document.cookie = name + "=" + value + "; expires=Tue, 19 Jan 2038 03:14:07 GMT";
}

export function getCookie(name, defaultValue) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : defaultValue;
}

export const IMAGE_FORMATS = ['16/9', '21/9', '4/3', '3/2', '297/210'];
export const IMAGE_FORMAT_NAMES = ['Widescreen 16/9', 'Ultrawide screen 21/9', 'Fullscreen 4/3', 'Photo 15x10', 'A4'];
