class Fetcher {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string, headers: HeadersInit = {}): Promise<{ body: T | null, status: number, error: string | null }> {
        // const token = getCookie('token') || '';
        // console.log('Token', token)
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                ...headers,
                // 'Authorization': token,
            },
        });
        return this.handleResponse(response);
    }

    async post<P, T>(endpoint: string, body: P, headers: HeadersInit = {}): Promise<{ body: T | null, status: number, error: string | null }> {
        // const token = getCookie('token') || '';
        // console.log('Token', token)
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
                // 'Authorization': token,
            },
            body: JSON.stringify(body),
        });
        return this.handleResponse(response);
    }

    async put<P, T>(endpoint: string, body: P, headers: HeadersInit = {}): Promise<{ body: T | null, status: number, error: string | null }> {
        // const token = getCookie('token') || '';
        // console.log('Token', token)
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
                // 'Authorization': token,
            },
            body: JSON.stringify(body),
        });
        return this.handleResponse(response);
    }

    async delete<P, T>(endpoint: string, body?: P, headers: HeadersInit = {}): Promise<{ body: T | null, status: number, error: string | null }> {
        // const token = getCookie('token') || '';
        // console.log('Token', token)
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: {
                ...headers,
                // 'Authorization': token,
            },
            body: body ? JSON.stringify(body) : '',
        });
        return this.handleResponse<T>(response);
    }

    private async handleResponse<T>(response: Response): Promise<{ body: T | null, status: number, error: string | null }> {
        if (response.status === 401) {
            localStorage.setItem('isLoggedIn', JSON.stringify(false));
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            if (window.location.href.includes('/admin')) window.location.href = '/login/admin?redirect=' + window.location.pathname;
            else if (window.location.href.includes('/collector')) window.location.href = '/login/collector?redirect=' + window.location.pathname;
            else if (!window.location.href.includes('/login')) window.location.href = '/login?redirect=' + window.location.pathname;
        }
        if (response.status === 403) {
            window.location.href = '/verify';
        }
        if (!response.ok) {
            const error = await response.text();
            console.error(error.length < 150 ? error : 'Someting went wrong');
            return { body: null, status: response.status, error: error }
        }
        return {
            body: await (async () => {
                try {
                    return await response.json();
                } catch {
                    return await response.text();
                }
            })(),
            status: response.status,
            error: null
        };
    }
}

const fetcher = new Fetcher('/api');

export default fetcher;