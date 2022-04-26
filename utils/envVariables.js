class EnvVariables {
    load_tokens() {
        require("dotenv").config();

        for (let [key, value] of Object.entries(process.env)) {
            this[key] = value;
        }
    }
}

module.exports = EnvVariables;