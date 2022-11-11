import { createClient } from 'redis';

export class EventServiceClass {
    Client = undefined;
    Subscriber = undefined;
    Publisher = undefined;
    Connected = false;
    
    constructor() {
        this.subscribe = this.subscribe.bind(this);
        this.publish = this.publish.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.initialize = this.initialize.bind(this);
    }

    subscribe(channel, callback) {
        this.Subscriber.subscribe(channel, callback);
    }

    publish(channel, message) {
        this.Publisher.publish(channel, message);
    }

    async unsubscribe(channel) {
        await this.Publisher.unsubscribe(channel);
    }

    async initialize() {
        if (!this.Client) {
            this.Client = createClient({
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                password: process.env.REDIS_PASSWORD,
            });

            this.Subscriber = this.Client.duplicate();
            this.Publisher = this.Client.duplicate();
        }
    
        if (this.Connected !== true) {
            await this.Subscriber.connect();
            await this.Publisher.connect();
        }

        this.Connected = true;
    }
}

const EventService = new EventServiceClass();

export default async function publish(channel, message) {
    await EventService.initialize();
    EventService.publish(channel, message);
};
