const ytdl = require('ytdl-core');


class Queue {
        constructor(music) {
                this.music = music;
                this.queue = [];
        }

        async add(item) {
                const infos = await getYTInfos(item);

                this.queue.push({
                        title: infos.title,
                        url: infos.video_url,
                        ownerName: infos.ownerChannelName
                });

                this.music.musicAdded();

        }
        addFullItem(item) {
                this.queue.push(item);
        }
        shift() {
                return this.queue.shift();
        }
        clear() {
                this.queue = [];
        }
        get(index) {
                if (index >= this.queue.length)
                        return "Out of bounds";
                return this.queue[index];
        }

        first () {
                if (this.queue.length === 0)
                        return null;
                return this.queue[0];
        }
        last() {
                if (this.queue.length == 0)
                        return null;
                return this.queue[this.queue.length - 1];
        }
        count() {
                return this.queue.length;
        }
        isEmpty() {
                return this.queue.length == 0;
        }
}

async function getYTInfos(url) {
        const infos = await ytdl.getInfo(url); // title ownerChannelName video_url
        return infos.videoDetails;
}

module.exports = Queue;