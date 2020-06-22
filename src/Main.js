import Bot from './Bot.js';
import { User, Sprite } from './Data/UserData.js';
import { UserInit, Move, ChatMessage, Roll } from './Data/ClientApi.js';
import { Log, Random } from './Util.js';

let sprite = new Sprite(858, 859);
let user = new User("Human Bean", "ffffff", 31, sprite);

const BotEvents = Bot.BotEvents;
const GameEvents = Bot.GameEvents;

let bot = new Bot();
bot
    .once(BotEvents.connect, () => { })
    .on(BotEvents.ready, initPlayer)
    .on(GameEvents.roll, (roll) => numQuest(roll), (roll) => roll.id != bot.id);
    
let tasks = [];

function answer (num, myNum) {
    if (num < myNum)
        chat(`${num} < ${myNum} Mine bigger`);
    else
        chat(`*промолчал (${num} > ${myNum})*`);
};

function numQuest (roll) {
    // const user = roll.id;
    bot.once(GameEvents.roll, (myRoll) => {
        // tasks.push(() => answer(roll.num, myRoll.num));
        answer(roll.num, myRoll.num);
    }, (r) => r.id == bot.id);
    tasks.push(sendRoll);
}

setInterval(() => {
    if (tasks.length > 0)
        (tasks.shift())();
}, 5000);

bot.connect();

function initPlayer () {
    bot.sendObject(new UserInit(bot.id, 'ext_lake', user));
    bot.sendObject(Move.toPosition(Random.minMax(-20, 20)));
}

function chat (msg) {
    bot.sendObject(new ChatMessage(msg));
}

function sendRoll () {
    bot.sendObject(new Roll());
}