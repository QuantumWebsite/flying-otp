export function randomToken() {
    let token = '';
    for (let i = 0; i < 4; i++) {
        token += Math.floor(Math.random() * 10);
    }

    return token;
}