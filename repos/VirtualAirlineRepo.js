import BaseRepo from './BaseRepo'

class VirtualAirlineRepoClass extends BaseRepo {
    constructor() {
        super('virtualAirline')
        this.upsert = this.upsert.bind(this)
        this.upsertByGuid = this.upsertByGuid.bind(this)
        this.findByOwnerId = this.findByOwnerId.bind(this)
        this.getFirst = this.getFirst.bind(this)
        this.determineCanSync = this.determineCanSync.bind(this)
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
            .then((x) => self.determineCanSync(x))
            .then((x) => (x && opts?.omit) ? self.omit(x, opts.omit) : x)
            .then((x) => (x && opts?.humanize) ? self.humanize(x, opts.humanize) : x)
            .then((x) => (x && opts?.serialize) ? self.serialize(x) : x)
    }

    determineCanSync (x) {
        if (!x) return null;
        let canSync = false;
    
        // if onAirSyncedAt is not null
        if (x.onAirSyncedAt) {
            const currentDate = new Date()
            const onAirSyncedAt = new Date(x.onAirSyncedAt)
            const ONE_MIN = 1*60*1000
    
            // if the difference between the current date and the onAirSyncedAt date is greater than 1 minute
            if ((currentDate - onAirSyncedAt) > ONE_MIN) {
                canSync = true
            }
        }
    
        return {
            ...x,
            canSync,
        }
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
            .then((x) => self.determineCanSync(x))
            .then((x) => (x && opts?.omit) ? self.omit(x, opts.omit) : x)
            .then((x) => (x && opts?.humanize) ? self.humanize(x, opts.humanize) : x)
            .then((x) => (x && opts?.serialize) ? self.serialize(x) : x)
    }

    async upsertByGuid(vaId, payload, opts) {
        const self = this;
        if (!vaId) throw new Error('vaId is required');
        if (!payload) throw new Error('payload is required');

        const query = {
            where: {
                Guid: (typeof vaId === 'string') ? vaId : vaId.toString(),
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
        .then((x) => self.determineCanSync(x))
        .then((x) => (x && opts?.omit) ? self.omit(x, opts.omit) : x)
        .then((x) => (x && opts?.humanize) ? self.humanize(x, opts.humanize) : x)
        .then((x) => (x && opts?.serialize) ? self.serialize(x) : x)
    }

    determineCanSync (x) {
        if (!x) return null;
        let canSync = false;
    
        // if onAirSyncedAt is not null
        if (x.onAirSyncedAt) {
            const currentDate = new Date()
            const onAirSyncedAt = new Date(x.onAirSyncedAt)
            const ONE_MIN = 1*60*1000
    
            // if the difference between the current date and the onAirSyncedAt date is greater than 1 minute
            if ((currentDate - onAirSyncedAt) > ONE_MIN) {
                canSync = true
            }
        } else {
            canSync = true
        }
    
        return {
            ...x,
            canSync,
        }
    }

    async getFirst(q, opts) {
        const self = this;
        const query = {
            where: {
                id: {
                    gt: 0,
                }
            },
            orderBy: (opts?.orderBy) ? opts.orderBy : undefined,
            include: (opts?.include) ? opts.include : undefined,
        }

        return await this.Model.findFirst(query)
        .then((x) => (x) ? self.determineCanSync(x) : x)
        .then((x) => (x && opts?.omit) ? self.omit(x, opts.omit) : x)
        .then((x) => (x && opts?.humanize) ? self.humanize(x, opts.humanize) : x)
        .then((x) => {
            if (x && opts?.serialize) {
                x.lastDividendsDistribution = x.lastDividendsDistribution.toString();
                x.createdAt = x.createdAt.toString()
                x.updatedAt = x.updatedAt.toString()
                return JSON.parse(JSON.stringify(x));
            } else {
                return x
            }
        })
    }

}

export const VirtualAirlineRepo = new VirtualAirlineRepoClass();
export default VirtualAirlineRepo;