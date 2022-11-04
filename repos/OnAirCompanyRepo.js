import BaseRepo from './BaseRepo'

class OnAirCompanyRepo extends BaseRepo {
    constructor() {
        super('onAirCompany')

        this.findByDiscordId = this.findByDiscordId.bind(this)
    }

    async findByDiscordId(discordId, opts) {
        const query = {
            where: {
                discordId,
            },
        };

        if (opts?.include) {
            query.include = opts.include;
        }

        return this.Model.findUnique(query).then((x) => (x && opts?.serialize) ? this.serialize(x) : x);
    }
}