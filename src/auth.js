class Auth {
    static cookieName = 'auth_token';
    static cookieExpiry = 30 * 24 * 60 * 60; // 30 days in seconds

    static async validatePassword(password, env) {
        return password === env.AUTH_PASSWORD;
    }

    static generateToken() {
        return crypto.randomUUID();
    }

    static createCookie(token) {
        return `${this.cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${this.cookieExpiry}`;
    }

    static async verifyAuth(request, env) {
        const cookie = request.headers.get('Cookie');
        if (!cookie) return false;

        const token = cookie.split(';')
            .find(c => c.trim().startsWith(`${this.cookieName}=`))
            ?.split('=')[1];

        return token ? true : false;
    }
}

export { Auth };