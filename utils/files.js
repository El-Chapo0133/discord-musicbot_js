const fs = require('node:fs');

class Files {
        writeFile(filename, data) {
                fs.writeFile(filename, data, err => {
                        if (err)
                                console.error(err);
                });
        }
        readFile(filename) {
                if (!fs.existsSync(filename))
                        console.error("File not exists");
                return fs.readFileSync(filename);
        }
}

module.exports = new Files();