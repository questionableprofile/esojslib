import { Serializeable } from './Interface.js';

export { User, Sprite };

class User extends Serializeable {
    name;
    color;
    character;
    sprite;

    /* Optional things for deserialization of server data */
    id;
    position;
    state;

    /**
     * @param {String} name User name
     * @param {String} color hex-color String of 6 symbols
     * @param {Integer} character character number
     * @param {Sprite} sprite user sprite
     */
    constructor (name, color, character, sprite) {
        super();
        this.name = name;
        this.color = color;
        this.character = character;
        this.sprite = sprite;
    }

    static Copy (user) {
        let ret = new User (user.name, user.color, user.character, Sprite.Copy(user.sprite));
        
        // should be just replaced with Object.assign...
        if (user.id)
            ret.id = user.id;
        if (user.position)
            ret.position = user.position;
        if (user.character)
            ret.character = user.character;
        if (user.state)
            ret.state = user.state;
        
        return ret;
    }
}

class Sprite extends Serializeable {
    body;
    emotion;
    cloth;
    accessory;

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