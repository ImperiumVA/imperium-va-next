import BaseRepo from './BaseRepo'

class MenuRepo extends BaseRepo {
    constructor() {
        super('menu')
        this.findBySlug = this.findBySlug.bind(this)
        this.toggleField = this.toggleField.bind(this)
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

export default new MenuRepo();