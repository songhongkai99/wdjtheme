Object.extend = function (destination, source) {
    if (!destination) return source;
    for (var property in source) {
        if (!destination[property]) {
            destination[property] = source[property];
        }
    }
    return destination;
}

Object.stringify || (Object.stringify = function (o) {
    if (window.JSON && JSON.stringify) {
        return JSON.stringify(o);
    }
    var arr = [];
    for (var n in this) {
        if (typeof this[n] == 'function') continue;
        arr.push('"' + n + '":' + this[n]);
    }
    return '{' + arr.join(',') + '}';
})

String.prototype.startsWith || (String.prototype.startsWith = function (v) {
    if (this.substring(0, 1) == v) {
        return true;
    }
    return false;
});

String.prototype.endsWith || (String.prototype.endsWith = function (v) {
    if (this.substring(this.length - 1) == v) {
        return true;
    }
    return false;
});

String.prototype.linkStartsWith || (String.prototype.linkStartsWith = function (v) {
    if (this.indexOf(v) == 0) {
        return true;
    }
    return false;
})

String.prototype.linkEndsWith || (String.prototype.linkEndsWith = function (v) {
    var reg = new RegExp('.*' + v + '$');
    if (reg.test(this)) { return true; }
    return false;
})

String.prototype.trim || (String.prototype.trim = function () {
    var reg = /^\s+|\s+$/g;
    return this.replace(reg, '');
})

String.prototype.tl || (String.prototype.tl = function () {
    var reg = /^\s+/g;
    return this.replace(reg, '');
})

String.prototype.tr || (String.prototype.tr = function () {
    var reg = /\s+$/g;
    return this.replace(reg, '');
})

String.prototype.isNull || (String.prototype.isNull = function () {
    if (this && this.length > 0) return false;
    return true;
})

String.prototype.parseJson || (String.prototype.parseJson = function () {
    if (window.JSON && JSON.parse) {
        return JSON.parse(this);
    }
    return (new Function("return " + this + ';'))();
})

String.prototype.size || (String.prototype.size = function () {
    return this.replace(/[^\x00-\xff]/g, '__').length;
})


Array.prototype.each || (Array.prototype.each = function (callback, args) {
    for (var i = 0; i < this.length; i++) {
        callback.call(this[i], i, this[i], args);
    }
})

Array.prototype.removeIndex || (Array.prototype.removeIndex = function (index) {
    for (var i = 0; i < this.length; i++) {
        if (i == index) {
            this.splice(i, 1);
            i--;
            break;
        }
    }
})

Array.prototype.remove || (Array.prototype.remove = function (v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == v) {
            this.splice(i, 1);
            i--;
        }
    }
})

Array.prototype.distinct || (Array.prototype.distinct = function () {
    for (var i = 0; i < this.length; i++) {
        for (var j = i + 1; j < this.length; j++) {
            if (this[i] == this[j]) {
                this.splice(i, 1);
                i--;
            }
        }
    }
})

Array.prototype.removeAll || (Array.prototype.removeAll = function () {
    for (var i = 0; i < this.length; i++) {
        this.splice(i, 1);
        i--;
    }
})

Array.prototype.indexOf || (Array.prototype.indexOf = function (v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == v) {
            return i;
        }
    }
    return -1;
})

Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function (v) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] == v) {
            return i;
        }
    }
    return -1;
})