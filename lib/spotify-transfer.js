require('dotenv').config();

const commander = require('commander');
const spotify = require('./spotify');
const login = require('./login');
const packageVersion = require('../package.json').version;

commander.version(packageVersion);

commander
    .command('import <filename> [playlistName]')
    .option('-d, --debug', 'display some debugging')
    .description('import music from file to spotify')
    .action((filename, playlistName, options) => {
        spotify({ filename, playlistName, isDebug: options.debug });
    });

commander.command('login').action(() => {
    login();
});

commander.parse(process.argv);
