/**
 * Author : Loris Levêque
 * Date : 19.02.2021
 * Description : Bot who can play musics, simple as f***
 * 
 * *********************************************************/

require('dotenv').config();
const discord = require('discord.js');
const Utils = require('./src/utils/utils.js');
const Router = require('./src/router/router.js');

const PREFIX = process.env.BOT_PREFIX;

const utils = new Utils();
const client = new discord.Client();
const router = new Router(client);

client.on('ready', () => {
    console.log(`Logged as ${client.user.tag}`);
});
client.on('message', (e) => {
    if (utils.stringStartsWith(e.content, PREFIX)) {
        const task = utils.removeFirstChar(e.content.split(' ')[0]);
        router.root({task, e}).then(result => {
            e.channel.send(`Task ${task} is done successfully`);
        }).catch(err => {
            e.channel.send(`Error at doing the task ${task}\nErr: ${err}`);
        });
    }
});

client.login(process.env.BOT_TOKEN);