

class Router {
    constructor(client) {
        this.client = client;
    }
    root(input) {
        return new Promise((resolve, reject) => {
            try {
                this[input.task](input.e);
                resolve(input.task);
            } catch(err) {
                reject(err);
            }
        });
    }
    ping(e) {
        e.channel.send(`Pong latency is ${Date.now() - e.createdTimestamp}ms\nDiscord API Latency is ${Math.round(this.client.ws.ping)}ms`);
    }
    play(e) {

    }
    pause(e) {
        
    }
    resume(e) {
        
    }
    dc(e) {
        
    }
    disconnect(e) {
        
    }
    
}

module.exports = Router;