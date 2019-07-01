import EventEmitter from 'events';
import utils from '../utils';

// server will need to automate itself
// if a player leaves, an event should fire
// if a player joins, an event should fire

class Server {
    events;
    players = {};

    constructor (mode, region, spaces) {
        this.region = region;
        this.mode = mode;
        this.id = utils.makeHash(`${this.region} ${this.mode}`);
        this.maxSpaces = spaces;
        this.events = new EventEmitter();

        this.bindEvents();

        // this method simulates the joining/leaving of players to the server
        // it simply operates on the assumption that a user might leave or join every five seconds
        // though obviously in the real work this would be event driven and random
        this.simulateServer();
    }

    bindEvents () {
        this.events.on('playerLeft', (player) => {
            this.events.emit('updateServer', this);
        });
        this.events.on('playerJoined', (player) => {
            this.events.emit('updateServer', this);
        });
    }

    hasSpacesAvailable () {
        return this.playerCount() < this.maxSpaces;
    }

    simulateServer () {
        setInterval(() => {
            let playerKeys = Object.keys(this.players);
            let randomPlayer = playerKeys[Math.floor(Math.random() * playerKeys.length)];

            if(typeof this.players[randomPlayer] !== 'undefined') {
                this.deletePlayer(randomPlayer);
            }
        }, 1000);
    }

    playerCount () {
        return Object.keys(this.players).length;
    }

    deletePlayer (player) {
        if(typeof this.players[player.id] !== 'undefined') {
            console.log(`Player '${player.id}' left server '${this.id}'`);
            delete this.players[player.id];
            this.events.emit('playerLeft');
        }
    }

    addPlayer (player) {
        player.currentServer = this.id;
        this.players[player.id] = player;
        this.events.emit('playerJoined', player);
        console.log(`Player '${player.id}' joined server '${this.id}'`);
    }

}

export default Server;
