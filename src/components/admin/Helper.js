export function converToSlug(title) {
    const str = title.replace(/^\s+|\s+$/g, '')
            .toLowerCase()
            // .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-') + "-" + (new Date().getTime()).toString(36);
    return str;
}

export function isValidImage(image) {
    var imageData = new Image();
    imageData.src = image;

    if (imageData.height === 0) {
        return "false";
    } else {
        return "true";
    }

}