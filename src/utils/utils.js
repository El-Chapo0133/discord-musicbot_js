

class Utils {
    constructor() {

    }
    stringStartsWith(input, prefix) {
        return input.slice(0, prefix.length) == prefix;
    }
    removeFirstChar(input) {
        return input.slice(1);
    }
}

module.exports = Utils;