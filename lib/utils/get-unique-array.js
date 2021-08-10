/**
 * Returns an array of objects with no duplicates
 * @param {Array} arr Array of Objects
 * @param {Array} keyProps Array of keys to determine uniqueness
 */
function getUniqueArray(arr, keyProps) {
    return Object.values(
        arr.reduce((uniqueMap, entry) => {
            const key = keyProps.map((k) => entry[k]).join('|');
            if (!(key in uniqueMap)) uniqueMap[key] = entry;
            return uniqueMap;
        }, {})
    );
}

module.exports = getUniqueArray;
