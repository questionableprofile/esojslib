export { Serializeable };

class Serializeable {
    serialize () {
        return JSON.stringify(this);
    }
}