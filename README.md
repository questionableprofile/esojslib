# esojslib
Node.js library for ESO

### Install
Using Github npm packages
```
$ npm install questionableprofile/esojslib
```

### Usage
```javascript
/* A simple bot that will answer 'Hello World!' to any message */

import { Bot, User, Sprite, Client } from 'esojslib';

const user = new User('Name', 'ffffff', 1, new Sprite(1, 2, 3));
const locationCode = 'ext_square';

const bot = new Bot();

bot
  .on(Bot.BotEvents.ready, (id) => new Client.UserInit(id, locationCode, user))
  .on(Bot.GameEvents.chat, (data) => bot.sendObject(new Client.ChatMessage('Hello World!'));

bot.connect();
```

More examples [here](https://github.com/questionableprofile/esojslib/tree/master/examples)
