function getSiblings(el, filter) {
    var siblings = [];
    var oel = el;
    el = el.parentNode.firstChild;
    do { if (!filter || filter(el)) siblings.push(el); } while (el = el.nextSibling);
    siblings.splice(siblings.indexOf(oel),1);
    return siblings;
}