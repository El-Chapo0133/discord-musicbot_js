const playlistsFilename = "./resources/playlists.json";

const Queue = require("./queue.js");
const files = require('../utils/files.js');

const ytdl = require('ytdl-core');


const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const { Message } = require("discord.js");

class Music {
        constructor() {
                this.queue = new Queue(this);
                this.connection = null;
                this.loadPlaylistsFromJsonFile();

                this.player = createAudioPlayer();

                this.player.on('stateChange', (_, newState) => {
                        if (newState.status === 'idle') {
                                if (this.queue.isEmpty())
                                        return;
                                
                                let lastPlayed = null;
                                if (!this.settings.loop)
                                        lastPlayed = this.queue.shift();
                                if (this.settings.loopqueue)
                                        this.queue.addFullItem(lastPlayed);
                                if (this.queue.isEmpty())
                                        return this.quitVoiceChannel();
                                this.playFirstItemFromQueue();
                        }
                });

                this.settings = {
                        loop: false,
                        loopqueue: true,
                }

                this.currentPlaylistIndex = null;
        }

        skip() {
                // this.player.stop(); // this trigger stateChange is guess
                let item = this.queue.shift();
                if (this.settings.loopqueue)
                        this.queue.addFullItem(item);
                if (this.queue.isEmpty())
                        return this.quitVoiceChannel();
                this.playFirstItemFromQueue();
        }
        
        async musicAdded() {
                // console.log(this.queue.last(), this.queue.count());
                
                if (!this.isPlaying())
                        this.playFirstItemFromQueue();
        }
        isInVoiceChannel() {
                return this.connection != null;
        }
        isPlaying() {
                return this.player.state.status === 'playing' || this.player.state.status === 'buffering';
        }
        loopToString() {
                return this.settings.loop ? "loop" : this.settings.loopqueue ? "loopqueue" : "none";
        }

        quitVoiceChannel() {
                this.player.stop();
                this.connection.disconnect();
                this.connection.destroy();
                this.connection = null;
                this.queue.clear();
                this.currentPlaylistIndex = null;
                this.loop = false;
                this.loopqueue = true;
        }
        getQueueString() {
                let queueStringed = "";
                for (let index = 0; index < this.queue.queue.length; index++) {
                        queueStringed += `${index}: ${this.queue.get(index).title}\n`;
                }
                return queueStringed;
        }
        getPlaylistsString() {
                let playlistsStringed = "";
                for (let index = 0; index < this.playlists.length; index++) {
                        playlistsStringed += `${index}: ${this.playlists[index].name} (${this.playlists[index].songs.length} music${this.playlists[index].songs.length == 1 ? "" : "s"})\n`;
                }
                return playlistsStringed;
        }
        
        async joinVoiceChannel(channel) {
                this.connection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator
                });
                this.connection.subscribe(this.player);
                
                try {
                        await entersState(this.connection, VoiceConnectionStatus.Ready, 30e3);
                } catch (error) {
                        this.connection.destroy();
                        throw error;
                }
        }
        
        playFirstItemFromQueue() {
                let resource = createAudioResource(ytdl(this.queue.first().url, { filter: "audioonly" }));

                this.player.play(resource);
                console.log(`Now playing '${this.queue.first().title}'`);
        }

        loadPlaylistsFromJsonFile() {
                this.playlists = JSON.parse(files.readFile(playlistsFilename)).playlists;
        }
        addPlaylist(name) {
                if (this.queue.count() == 0)
                        return false;
                let json = JSON.parse(files.readFile(playlistsFilename));
                json.playlists.push({
                        name: name,
                        songs: [...this.queue.queue]
                });
                files.writeFile(playlistsFilename, JSON.stringify(json));
                this.playlists = json.playlists;
                return true;
        }
        loadPlaylistToQueue(entry) {
                if (isInputInt(entry)) {
                        return this.loadPlaylistFromIndex(entry);
                }
                const index = this.getPlaylistIndexFromName(entry);
                if (index == -1)
                    return true;
                return this.loadPlaylistFromIndex(index);
        }
        addMusicToPlaylist(item) {
                let json = JSON.parse(files.readFile(playlistsFilename));
                json.playlists[this.currentPlaylistIndex].songs.push(item);
                files.writeFile(playlistsFilename, JSON.stringify(json));
        }
        loadPlaylistFromIndex(entry) {
                const entryInt = parseInt(entry);
                if (entryInt >= this.playlists.length)
                        return true;
                this.playlists[entryInt].songs.forEach(item => {
                        this.queue.addFullItem(item);
                });
                this.currentPlaylistIndex = entryInt;
                this.playFirstItemFromQueue();
                return false;
        }
        getPlaylistIndexFromName(entry) {
                for (let index = 0; index < this.playlists.length; index++) {
                        if (entry === this.playlists[index].name)
                                return index;
                }
                return -1; // not found
        }


        switchLoop() {
                this.settings.loopqueue = false;
                this.settings.loop = !this.settings.loop;
        }
        switchLoopQueue() {
                this.settings.loop = false;
                this.settings.loopqueue = !this.settings.loopqueue;
        }
}

function isInputInt(input) {
        // try {
        //         parseInt(input);
        //         return true;
        // } catch {
        //         return false;
        // }
        // console.log(parseInt(input).toString() == "NaN");
        return parseInt(input).toString() != "NaN";
}

module.exports = Music;