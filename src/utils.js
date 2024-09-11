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
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : defaultValue;
}

