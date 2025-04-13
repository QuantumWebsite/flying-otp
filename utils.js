import crypto from 'crypto';

export function randomToken() {
    return crypto.randomInt(1000, 10000).toString();
}
