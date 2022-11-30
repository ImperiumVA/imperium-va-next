import Redis from 'ioredis'

export class EventServiceClass {
    publisher = undefined;
    subscriber = undefined;
    cfg = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        db: process.env.REDIS_DATABASE || "0",
        password: process.env.REDIS_PASSWORD || '',
    };

    constructor(cfg) {
        if (cfg) {
            this.cfg = cfg;
        }

        this.initialize = this.initialize.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.emit = this.emit.bind(this);

        this.initialize();
    }

    initialize() {
        if (this.publisher) return;

        this.publisher = new Redis({
            host: this.cfg.host,
            port: (typeof this.cfg.port !== Number) ? Number(this.cfg.port) : this.cfg.port,
            db: this.cfg.db,
            password: this.cfg.password,
        });

        if (this.subscriber) return;

        this.subscriber = new Redis({
            host: this.cfg.host,
            port: (typeof this.cfg.port !== Number) ? Number(this.cfg.port) : this.cfg.port,
            db: this.cfg.db,
            password: this.cfg.password,
        });
    }

    subscribe = async (channel) => {
        const self = this;
        return new Promise((resolve, reject) => {
            
            if (!channel) return reject('Channel name is required');
            Logger.info(`EventService: Subscribing to channel '${channel}'`);

            self.subscriber.subscribe(channel, (err, count) => {
                if (err) {
                    Logger.error(`EventService: Error subscribing to channel '${channel}': ${err}`);
                    return reject(err);
                }

                Logger.info(`EventService: Subscribed to channel '${channel}', ${count} total subscribed`);
                return resolve(null, count);
            });
        });
    }

    emit = (channel, data) => {
        if (!channel) return false;
        data = (typeof data !== 'string') ? JSON.stringify(data) : data;

        console.log(`Publishing message to '${channel}' channel`, data)

        this.publisher.publish(channel, data);
    }
}

export const EventService = new EventServiceClass();
export default EventService;
