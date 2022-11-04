import BaseRepo from './BaseRepo'

class MenuRepo extends BaseRepo {
    constructor() {
        super('menu')
        this.findBySlug = this.findBySlug.bind(this)
        this.findAll = this.findAll.bind(this)
    }

    async findAll(opts) {
        const query = {
            where: {
                isDisabled: (opts?.isDisabled) ? opts.isDisabled : false,
                isAuthenticated: (opts?.isAuthenticated) ? opts.isAuthenticated : undefined,
            },
            orderBy: {
                order: (opts?.orderBy) ? opts.orderBy : 'asc',
            },
            include: (opts?.include) ? opts.include : undefined,
        }

        return this.Model.findMany(query).then((x) => (x && opts?.serialize) ? this.serialize(x) : x);
    }
    

    async findBySlug(slug, opts) {
        const query = {
            where: {
                slug,
            },
        }

        if (opts?.include) {
            query.include = opts.include;
        }

        return this.Model.findUnique(query).then((x) => (x && opts?.serialize) ? this.serialize(x) : x);
    }
}

export default new MenuRepo();