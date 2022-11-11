import jwt from 'jsonwebtoken';

class TokenServiceClass {
    Algorithm = process.env.JWT_ALGORITHIM || 'HS256';
    SecretKey = process.env.JWT_SECRET_KEY;
    Audience = process.env.NEXTAUTH_URL;

    constructor() {
        this.sign = this.sign.bind(this);
        this.verify = this.verify.bind(this);
        this.decode = this.decode.bind(this);

    }

    async sign(payload, opts) {
        if (!payload) throw new Error('Payload is required');

        const jwtSignOptions = {
            expiresIn: opts?.expiresIn || '1h',
            algorithm: opts?.algorithm || this.Algorithm,
            notBefore: opts?.notBefore || '0s',
            audience: opts?.audience || this.Audience,
        };
        
        return jwt.sign(payload, this.SecretKey, jwtSignOptions);
    }

    async verify(token, opts) {
        if (!token) throw new Error('Token is required');

        return jwt.verify(token, this.SecretKey, opts);
    }

    async decode(token, opts) {
        if (!token) throw new Error('Token is required');

        return jwt.decode(token, {
            complete: opts?.complete || false,
        });
    }
}

export const TokenService = new TokenServiceClass();
export default TokenService;