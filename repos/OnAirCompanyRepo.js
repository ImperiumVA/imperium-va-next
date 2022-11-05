import BaseRepo from './BaseRepo'

class OnAirCompanyRepo extends BaseRepo {
    constructor() {
        super('onAirCompany')
        this.upsert = this.upsert.bind(this)
        this.upsertByGuid = this.upsertByGuid.bind(this)
    }

    async upsert(id, payload, opts) {
        if (!id) throw new Error('id is required');
        if (!payload) throw new Error('payload is required');

        const query = {
            where: {
                id: (typeof id === 'string') ? Number(id) : id,
            },
            update: {
                ...payload,
            },
            create: {
                ...payload,
            },
        }

        return await this.Model.upsert(query)
    }

    async upsertByGuid(companyId, payload, opts) {
        if (!companyId) throw new Error('companyId is required');
        if (!payload) throw new Error('payload is required');

        const query = {
            where: {
                companyId: (typeof companyId === 'string') ? companyId : companyId.toString(),
            },
            update: {
                ...payload,
            },
            create: {
                ...payload,
            },
            include: (opts?.include) ? opts.include : undefined,
        }

        return await this.Model.upsert(query)
        .then((x) => (x && opts?.omit) ? self.omit(x, opts.omit) : x)
        .then((x) => (x && opts?.humanize) ? self.humanize(x, opts.humanize) : x)
        .then((x) => (opts?.serialize) ? self.serialize(x) : x)
    }
}

export default new OnAirCompanyRepo();