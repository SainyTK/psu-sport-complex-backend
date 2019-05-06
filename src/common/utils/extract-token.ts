export function extractToken(req): string {
    return req.headers.authorization.split(' ')[1];
}