const fs = require('fs');

const createFile = (path, content, callback) => {
    fs.writeFileSync(path, content, (error) => {
        if (callback) callback(error);

        if (error) throw error;
    });
};

module.exports = createFile;
