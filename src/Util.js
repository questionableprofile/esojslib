export { Log, Random };

const Log = {
    d: (message) => console.log(`Debug: ${message}`),
    err: (message) => console.error(`Error: ${message}`),
    info: (message) => console.info(`Info: ${message}`)
}

const Random = {
    minMax: (min, max) => Math.round(min + Math.random() * (max - min)),
    fromZero: (max) => Random.minMax(0, max)
}