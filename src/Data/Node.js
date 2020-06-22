import { Serializeable } from './Interface.js';
import { User } from './UserData.js';

class Node extends Serializeable {
    code;
    actionCode;
    timecode;
    users = [];

    static Copy (obj) {
        const ret = new Node();
        ret.code = obj.code;
        ret.actionCode = obj.actionCode;
        ret.timecode = obj.timecode;

        if (obj.users && obj.users instanceof Array)
            obj.users.forEach(user => ret.users.push(User.Copy(user)));
        
        return ret;
    }
}

export default Node;