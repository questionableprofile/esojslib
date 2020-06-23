import WebSocket from 'websocket';

import { EventEmitter } from 'events';

import { Log, Random } from './Util.js';
import { Serializeable } from './Data/Interface.js';
import { ClientCodes, ServerCodes } from './Data/ClientApi.js';
import Node from './Data/Node.js';
import { User } from './Data/UserData.js';
import Config from './Config.js';

const WebSocketClient = WebSocket.client;

const BotEvents = {
    connected: 'connected',
    ready: 'idAcquired',
    socketMessage: 'wsMessage',
    disconnected: 'disconnected',
    error: 'error'
};

const GameEvents = ServerCodes;

class Bot {
    static GameEvents = GameEvents;
    static BotEvents = BotEvents;

    config;

    client;
    connection;
    
    #id;
    eventEmitter = new EventEmitter();
    handlerPairs = [];

    get id () {
        return this.#id;
    }

    get eventEmitter () {
        return null;
    }

    set eventEmitter (value) {
        return;
    }

    constructor (userConfig = null) {
        if (!userConfig) {
            Log.warn('constructing client, using default configuration');
            this.config = Config.Default();
        }
        else
            this.config = Config.From(userConfig);
        
        this.client = new WebSocketClient();
        this.client.on('connect', (conn) => this.connnectHandler(conn));
    }

    connect () {
        this.client.connect(this.config.WsUrl);
    }

    connnectHandler (connection) {
        Log.d('socket connected');

        this.connection = connection;
        const pingTask = setInterval(() => this.sendString('ping', 10 * 1000));

        this.eventEmitter.emit(BotEvents.connected);

        connection.on('message', (message) => this.messageHandler(message));

        connection.on('close', () => {
            Log.d(`connection ${this.id} closed`);
            this.eventEmitter.emit(BotEvents.disconnected);
        });

        connection.on('error', (error) => {
            Log.err(`${error.toString()}`);
            this.eventEmitter.emit(BotEvents.error, error);
        });
    }

    messageHandler (message) {
        if (message.type == 'utf8') {
            if (!this.#id) {
                this.#id = parseInt(message.utf8Data);
                this.eventEmitter.emit(BotEvents.ready, this.#id);
            }
            else {
                let parsed = JSON.parse(message.utf8Data);
                this.eventEmitter.emit(BotEvents.socketMessage, parsed);
                this.processRawGameEvent(parsed);
            }
        }
    }

    /**
     * 
     * @param {Object} obj parsed JSON coming from socket
     * @todo should intelligently cast to predefined data type instead of emitting raw objects. Done?
     */
    processRawGameEvent (obj) {
        let data;
        switch (obj.reason) {
            case GameEvents.nodeData:
                data = Node.Copy(obj);
                break;
            case GameEvents.userJoined:
                data = User.Copy(obj.user);
                break;
            case GameEvents.userLeft:
                data = obj.id;
                break;
            case GameEvents.userUpdate:
                data = User.Copy(obj.user);
                break;
            case GameEvents.nodeAction:
                data = obj.code;
                break;
            case GameEvents.map:
                data = obj.data;
                break;

            case GameEvents.chat:
            case GameEvents.dice:
            case GameEvents.roll:
            case GameEvents.tryMessage:
                data = obj;
                break;
                
            default:
                data = obj;
        }
        this.eventEmitter.emit(obj.reason, data);
    }

    /**
     * @param {Serializeable} obj
     * @returns void
     */
    sendObject (obj) {
        if (obj instanceof Serializeable && this.connection && this.connection.connected)
            this.sendString(obj.serialize());
    }

    /**
     * send UTF String to socket
     * @param {String} string UTF-8 string
     */
    sendString (string) {
        if (this.connection && this.connection.connected)
            this.connection.sendUTF(string);
    }

    /**
     * auto-detect `message` type and send it
     * @param {any} message message of any type
     */
    send (message) {
        if (this.connection && this.connection.connected)
            this.connection.send(message);
    }

    /**
     * 
     * @param {String} eventCode event code
     * @param {function([eventArgument]...) : void } handler callback called when event occured
     * @param {function([eventsArgument]...) : boolean } predicate function that decide should `handler` be called or not
     * @returns {Bot} `Bot` instance to allow builder-like template
     */
    on (eventCode, handler, predicate = (args) => true) {
        const events = this.eventEmitter;
        const f = (args) => {
            if (predicate(args))
                handler(args);
        };
        events.on(eventCode, f);
        this.handlerPairs.push([handler, f]);

        return this;
    }

    /**
     * 
     * @param {String} eventCode event code
     * @param {function([eventArgument]...) : void } handler callback called when event occured
     * @param {function([eventsArgument]...) : boolean } predicate function that decide should `handler` be called or not
     * @returns {Bot} Bot instance to allow builder-like template
     */
    once (eventCode, handler, predicate = (args) => true) {
        const events = this.eventEmitter;
        const f = (args) => {
            if (predicate(args)) {
                handler(args);
                this.off(eventCode, handler);
                // events.off(eventCode, f);
            }
        };
        this.handlerPairs.push([handler, f]);
        events.on(eventCode, f);

        return this;
    }

    off (eventCode, handler) {
        const pairs = this.handlerPairs;
        let index = pairs.findIndex(pair => pair[0] === handler);
        if (index >= 0) {
            this.eventEmitter.off(eventCode, pairs[index][1]);
            pairs.splice(index, 1);
        }
        // else
            // Log.d('Handler not found');
    }
}

export default Bot;