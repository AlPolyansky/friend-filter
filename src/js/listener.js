export default function(type, cb) {
    document.addEventListener(type, function(e) {
        if (typeof cb === 'function') {
            cb(e);
        } else {
            throw new Error('cb is not a function');
        }
    });
}