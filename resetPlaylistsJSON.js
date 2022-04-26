const fs = require('node:fs');

fs.writeFile(
        './resources/playlists.json',
        fs.readFileSync('./resources/playlists_origin.json'),
        err => {
                if (err)
                        console.error(err);
                console.log("playlist.json has been resetted");
        }
);