import BaseRepo from './BaseRepo'

class AccountRepo extends BaseRepo {
    constructor() {
        super('discordAccount')
        this.findByDiscordId = this.findByDiscordId.bind(this)
        this.toggleField = this.toggleField.bind(this)
    }

    async findByDiscordId(discordId, opts) {
        const self = this;
        if (!discordId) throw new Error('Discord ID is required');

        const query = {
            where: {
                discordId,
            },
        }

        if (opts?.include) {
            query.include = opts.include;
        }

        return this.Model.findUnique(query)
            .then((x) => (x && opts?.humanize) ? self.humanize(x, opts.humanize) : x)
            .then((x) => (opts?.serialize) ? self.serialize(x) : x)
    }

    async toggleField(id, fieldKey, opts) {
        const self = this;
        const x = await this.findById(id);

        if (!x) {
            throw new Error('Account not found');
        }

        x[fieldKey] = !x[fieldKey];

        return await this.update(x.id, x, opts);
    }
}

export default new AccountRepo();