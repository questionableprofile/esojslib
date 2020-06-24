import { Bot, Config, Client, User, Sprite } from 'esojslib';

// Configuration object
let config = {
	WsUrl: 'wss://www.esonline.cf/ws',
	Log: {
		// Optional. Will enable all library debug logs
		debugLevel: 0
	}
};

// sets the config object as default for library
Config.AssignDefault(Config.From(config));

let bot = new Bot(config);

bot
	// initialize player when connected to server
	.on(Bot.BotEvents.ready, (id) => bot.sendObject(new Client.UserInit(id, 'ext_tower_top', new User('Name', 'fdfdfd', 31, new Sprite(852, 853, 0)))))
	.on(Bot.GameEvents.dice, (dice) => bot.sendObject(new Client.DiceRoll([Client.Dice.Roll(3, 6)])))
	.on(Bot.GameEvents.roll, (roll) => bot.sendObject(new Client.Roll()));

bot.connect();
