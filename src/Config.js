let defaultInstance;

class Config {
    WsUrl = 'wss://www.esonline.cf/ws';

    Log = {
        verbose: false,
        supressWarnings: false,
        debugLevel: 2,
    };

    /**
     * Generate an instance with default settings
     */
    static Default () {
        return new Config();
    }

    static From (object) {
        return Object.assign(new Config(), object);
    }

    static GetDefault () {
        if (!defaultInstance)
            defaultInstance = Config.Default();
        return defaultInstance;
    }

    /**
     * set new default global configuration 
     * @param {Config} config new Config instance to be used as default
     */
    static AssignDefault (config) {
        defaultInstance = config;
    }
}

export default Config;