import { Serializeable } from './Interface.js';
import { User, Sprite} from './UserData.js';

export {
    ClientCodes,
    ServerCodes,

    UserInit,
    ChatMessage,
    UpdateSprite,
    Move,
    Roll,
    NodeAction,
    Dice,
    DiceRoll
};

/**
 * Socket message type strings for client messages
 */
const ClientCodes = {
    userInit: 'userInit',
    chat: 'chat',
    sprite: 'updateSprite',
    move: 'clientMove',
    roll: 'clientRoll',
    dice: 'diceRoll',
    nodeAction: 'performAction'
};

/**
 * Socket message type strings for server messages
 */
const ServerCodes = {
    chat: 'chat',
    nodeData: 'nodeData',
    nodeAction: 'nodeAction',
    userUpdate: 'userUpdate',
    userJoined: 'userJoin',
    userLeft: 'userLeave',
    dice: 'diceResult',
    roll: 'userRoll',
    try: 'tryMessage',
    map: 'mapData',
    broadcast: 'serverBroadcast',
    timecode: 'serverTimecode'
    /* to be continued... */
};

/**
 * Base class for every socket message, containing message type
 */
class Base extends Serializeable {
    reason;

    /**
     * @param {String} reason socket message type
     */
    constructor (reason) {
        super();
        this.reason = reason;
    }
}

/**
 * Contains UsedData + user server id and Node code
 */
class UserInit extends User {
    /* Костыль. Требуется множественное наследование от Base и User */
    reason;
    id;
    node;

    /**
     * 
     * @param {Integer} id user server id
     * @param {String} node Node code
     * @param {User} user User instance
     */
    constructor (id, node, user) {
        super(user.name, user.color, user.character, Sprite.Copy(user.sprite));
        this.reason = ClientCodes.userInit;
        this.id = id;
        this.node = node;
    }
}

/**
 * Simply a String with a plain text inside
 */
class ChatMessage extends Base {
    message;

    constructor (text) {
        super(ClientCodes.chat);
        this.message = text;
    }
}

/**
 * Copies existing sprite's data 
 */
class UpdateSprite extends Base {
    sprite;

    constructor (sprite) {
        super(ClientCodes.sprite);
        this.sprite = Sprite.Copy(sprite);
    }
}

/**
 * Changing Node position, or changing Node
 */
class Move extends Base {
    target;
    node;
    position;

    constructor (target, node, position) {
        super(ClientCodes.move);
        this.target = target;
        this.node = node;
        this.position = position;
    }

    static toPosition (position) {
        return new Move('position', null, position);
    }

    static toNode (node) {
        return new Move('node', node, null);
    }
}

/**
 * Contains no data. Just request to roll 1-100 in chat.
 */
class Roll extends Base {
    constructor () {
        super(ClientCodes.roll);
    }
}

/**
 * Just an action code, unique for every node
 */
class NodeAction extends Base {
    code;

    constructor (code) {
        super(ClientCodes.nodeAction);
        this.code = code;
    }
}

class Dice {
    num;
    count;
    sides;

    /**
     * Dice single roll type representation
     * @param {Integer} num the result number from server
     * @param {Integer} count how many dices of this type we want to throw. 0 < N <= 12
     * @param {Integer} sides number of sides of the dice. 2 < N <= 16
     */
    constructor (num, count, sides) {
        this.num = num;
        this.count = count;
        this.sides = sides;
    }

    static Roll (count, sides) {
        return new Dice(-1, count, sides);
    }

    static Result (obj) {
        return Object.assign(new Dice(), obj);
    }
}

class DiceRoll extends Base {
    rolls;

    /**
     * @param {Array<Dice>} rolls array that represent dices we want to throw
     */
    constructor (rolls) {
        super(ClientCodes.dice);
        this.rolls = rolls;
    }
}