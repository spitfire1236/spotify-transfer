const config = require('../config');

const createPlaylist = async (name) => {
    const {
        body: { id },
    } = await config().api.createPlaylist(name, { public: true });

    return id;
};

module.exports = createPlaylist;
