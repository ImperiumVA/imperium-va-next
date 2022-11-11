import BaseRepo from './BaseRepo'

class EmailRepoClass extends BaseRepo {
    constructor() {
        super('email')
    }
}

export const EmailRepo = new EmailRepoClass();
export default EmailRepo;