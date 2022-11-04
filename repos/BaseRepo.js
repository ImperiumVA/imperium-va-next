import prisma from '@db'
import moment from 'moment'   

function _humanize(date) {
    if (!date) throw new Error('Date is required');
    const now = moment();
    const then = moment(date);
    const diff = now.diff(then, 'days');

    if (diff < 1) {
        return 'Today';
    }

    if (diff < 2) {
        return 'Yesterday';
    }

    return then.format('MMMM Do YYYY');
}

export class BaseRepo {
    Model;
    prisma = prisma;

    constructor(model) {
        if (!model) throw new Error('No model name provided');
        
        this.Model = this.prisma[model];
        this.create = this.create.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
        this.destroy = this.destroy.bind(this);
        this.humanize = this.humanize.bind(this);
        this.serialize = this.serialize.bind(this);
        this.omit = this.omit.bind(this);
        
    }

    serialize(x) {
        if (!x) throw new Error('Record is required');
        return JSON.parse(JSON.stringify(x));
    }

    humanize(x, keys) {
        if (!x) throw new Error('Record is required');
        if (!keys) throw new Error('Keys are required');

        if (!Array.isArray(keys)) throw new Error('Keys must be an array');

        keys.forEach((h) => {
            Object.keys(x).forEach((key) => {
                if (key === h) {
                    x[`humanized_${key}`] = _humanize(x[key]);
                }
            });
        });

        return x;
    };

    omit(x, keys) {
        if (!x) throw new Error('Record is required');
        if (!keys) throw new Error('Keys are required');

        const obj = { ...x };
        keys.forEach((key) => delete obj[key]);
        return obj;
    }

    async create(newX, opts) {
        if (!newX) throw new Error('New Record is required');

        return await this.Model.create({
            data: newX,
        }).then((x) => opts?.serialize ? this.serialize(x) : x);
    }

    async findAll(opts) {
        const query = {}

        if (opts?.include) {
            query.include = opts.include;
        }

        return this.Model.findMany(query)
            .then((x) => opts?.humanize ? this.humanize(x, opts.humanize) : x)
            .then((x) => opts?.serialize ? this.serialize(x) : x);
    }

    async findById(id, opts) {
        if  (!id) throw new Error('Id is required');
        
        const query = {
            where: {
                id: (typeof id !== 'number') ? Number(id) : id,
            },
        }

        if (opts?.include) {
            query.include = opts.include;
        }

        return this.Model.findUnique(query)
            .then((x) => (x && opts?.humanize) ? this.humanize(x, opts.humanize) : x)
            .then((x) => (x && opts?.serialize) ? this.serialize(x) : x);
    }

    async destroy(id, opts) {
        if (!id) throw new Error('Id is required');

        const query = {
            where: {
                id: (typeof id !== 'number') ? Number(id) : id,
            },
        }

        return await this.Model.delete(query)
            .then((x) => (x && opts?.humanize) ? this.humanize(x, opts.humanize) : x)
            .then((x) => (x && opts?.serialize) ? this.serialize(x) : x);;
    }
}

export default BaseRepo