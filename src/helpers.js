function hashCode(str) {
    if (str.length == 0) return 0;

    var hash = 0,
        i, chr, len;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

exports.hashCode = hashCode;