import BaseRepo from './BaseRepo'

class OnAirCompanyRepo extends BaseRepo {
    constructor() {
        super('onAirCompany')
        this.upsert = this.upsert.bind(this)
        this.upsertByGuid = this.upsertByGuid.bind(this)
        this.findByOwnerId = this.findByOwnerId.bind(this)
    }

    async findByOwnerId(ownerId, opts) {
        const self = this;
        if (!ownerId) throw new Error('ownerId is required');
        const query = {
            where: {
                ownerId: (typeof ownerId !== 'number') ? Number(ownerId) : ownerId,
            },
            orderBy: (opts?.orderBy) ? opts.orderBy : undefined,
            include: (opts?.include) ? opts.include : undefined,
        }

        return await this.Model.findUnique(query)
            .then((x) => (x && opts?.omit) ? self.omit(x, opts.omit) : x)
            .then((x) => (x && opts?.humanize) ? self.humanize(x, opts.humanize) : x)
            .then((x) => (opts?.serialize) ? self.serialize(x) : x)
    }

    async upsert(id, payload, opts) {
        const self = this;
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
            .then((x) => (x && opts?.omit) ? self.omit(x, opts.omit) : x)
            .then((x) => (x && opts?.humanize) ? self.humanize(x, opts.humanize) : x)
            .then((x) => (opts?.serialize) ? self.serialize(x) : x)
    }

    async upsertByGuid(companyId, payload, opts) {
        const self = this;
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