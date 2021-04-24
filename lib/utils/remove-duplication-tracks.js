const removeDuplicationTracks = (array) => {
    const separate = '----';
    const foo = array
        .map(({ name, artist }) => artist && name && [artist, name].join(separate))
        .filter(Boolean);

    return [...new Set(foo)].map((item) => {
        const [artist, name] = item.split(separate);

        return {
            artist,
            name,
        };
    });
};

module.exports = removeDuplicationTracks;
