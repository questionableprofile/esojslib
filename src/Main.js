import Bot from './Bot.js';
import Config from './Config.js';
import { User, Sprite } from './Data/UserData.js';
import { UserInit, Move, ChatMessage, Roll, DiceRoll, Dice } from './Data/ClientApi.js';
import { Log, Random } from './Util.js';

const sprite = new Sprite(852, 853, 0);
const user = new User("Human Bean", "ffffff", 31, sprite);
const nodeCode = 'ext_tower_top';

const BotEvents = Bot.BotEvents;
const GameEvents = Bot.GameEvents;

const targetId = 2;
let target;

const myConfig = {
    Log: {
        debugLevel: 0
    }
};

Config.AssignDefault(Config.From(myConfig));

let bot = new Bot();
bot
    .once(BotEvents.connect, () => { })
    .on(BotEvents.ready, initPlayer)
    // .on(GameEvents.roll, (roll) => numQuest(roll), (roll) => roll.id != bot.id);
    .on(GameEvents.nodeData, (n) => {
        n.users.forEach(u => {
            if (u.id === targetId) {
                target = User.Copy(u);
                Log.d(`target ${target.name}:${target.id} ${target.position} acquired`);
                bot.sendObject(Move.toPosition(target.position));
            }
        });
    })
    .on(GameEvents.userUpdate, (data) => {
        if (target) {
            if (data.id === target.id && data.position != target.position) {
                target.position = data.position;
                if (target.position)
                    bot.sendObject(Move.toPosition(target.position + Random.minMax(-15, 15)))
                    // bot.sendObject(Move.toPosition(Random.minMax(-20, 20)));
            }
        }
    })


bot.connect();

function initPlayer (id) {
    user.id = id;
    bot.sendObject(new UserInit(bot.id, nodeCode, user));
    // bot.sendObject(Move.toPosition(Random.minMax(-20, 20)));
    // bot.sendObject(Move.toPosition(-50));
    bot.sendObject(new DiceRoll([Dice.Roll(2, 6)]));
}

function chat (msg) {
    bot.sendObject(new ChatMessage(msg));
}

function sendRoll () {
    bot.sendObject(new Roll());
}