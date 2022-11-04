import BaseRepo from './BaseRepo'

class DiscordAccountRepo extends BaseRepo {
    constructor() {
        super('discordAccount')
        this.findByDiscordId = this.findByDiscordId.bind(this)
        this.toggleAdmin = this.toggleAdmin.bind(this)
        this.serialize = this.serialize.bind(this)
    }

    async findByDiscordId(discordId, opts) {
        const query = {
            where: {
                discordId,
            },
        }

        if (opts?.include) {
            query.include = opts.include;
        }

        return this.Model.findUnique(query).then((x) => {
            if (opts?.serialize) {
                x = this.serialize(x);
            }

            if (opts?.omit) {
                x = this.omit(x, opts.omit);
            }
        });
    }

    async toggleAdmin(id) {
        const account = await this.findById(id);

        if (!account) {
            throw new Error('Account not found');
        }

        account.isAdmin = !account.isAdmin;

        return this.update(account.id, account);
    }
}

export default new DiscordAccountRepo();