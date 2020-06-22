import { Serializeable } from './Interface.js';
export { User, Sprite };

class User extends Serializeable {
    name;
    color;
    character;
    sprite;

    /* String, String, Int, Sprite */
    constructor (name, color, character, sprite) {
        super();
        this.name = name;
        this.color = color;
        this.character = character;
        this.sprite = sprite;
    }

    static Copy (user) {
        return new User (user.name, user.color, user.character, Sprite.Copy(user.sprite));
    }
}

class Sprite extends Serializeable {
    body;
    emotion;
    cloth;
    accessory;

    /* Int... */
    constructor (body, emotion = 0, cloth = 0, accessory = 0) {
        super();
        this.body = body;
        this.emotion = emotion;
        this.cloth = cloth;
        this.accessory = accessory;
    }

    static Copy (sprite) {
        return new Sprite (sprite.body, sprite.emotion, sprite.cloth, sprite.accessory);
    }
}