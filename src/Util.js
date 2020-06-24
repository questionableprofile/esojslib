import Config from './Config.js';

export { Log, Random };

const Log = {
    d: (message, level = 0) => 
    {
        if (level >= Config.GetDefault().Log.debugLevel)
            console.log(`ESO Debug: ${message}`)
    },
    err: (message) => console.error(`ESO Error: ${message}`),
    info: (message) => console.info(`ESO Info: ${message}`),
    warn: (message) => {
        if (!Config.GetDefault().Log.supressWarnings)
            console.warn(`ESO Warning: ${message}`);
    }
}

const Random = {
    minMax: (min, max) => Math.round(min + Math.random() * (max - min)),
    fromZero: (max) => Random.minMax(0, max)
}