export const DEFAULT_SESSION_COOKIE_NAME = 'split_bill_session';
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type CookieValue = {
    value: string;
};

type SessionCookieOptions = {
    httpOnly: boolean;
    maxAge: number;
    path: string;
    sameSite: 'lax';
    secure: boolean;
};

type SessionCookieReader = {
    get: (name: string) => CookieValue | undefined;
};

type SessionCookieWriter = {
    set: (name: string, value: string, options: SessionCookieOptions) => void;
};

export function getSessionCookieName(): string {
    return process.env.SESSION_COOKIE_NAME?.trim() || DEFAULT_SESSION_COOKIE_NAME;
}

export function setSessionUserIdCookie(cookieStore: SessionCookieWriter, userId: string): void {
    cookieStore.set(getSessionCookieName(), userId, {
        httpOnly: true,
        maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
}

export function getSessionUserId(cookieStore: SessionCookieReader): string | null {
    const sessionUserId = cookieStore.get(getSessionCookieName())?.value?.trim();

    return sessionUserId || null;
}
