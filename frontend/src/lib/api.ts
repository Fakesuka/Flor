import { useAuthStore } from '@/store/authStore';
import { API_BASE_URL } from '@/lib/constants';

interface LoginData {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
}

interface ProductParams {
    is_popular?: boolean;
    is_new?: boolean;
    category?: string;
    search?: string;
    page?: number;
}

interface ProfileUpdateData {
    first_name?: string;
    last_name?: string;
    phone?: string;
    loyalty_card_number?: string;
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const token = useAuthStore.getState().token;

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        // If 401, maybe logout?
        if (res.status === 401) {
            useAuthStore.getState().logout();
        }
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function getProducts(params?: ProductParams) {
    const filtered: Record<string, string> = {};
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) filtered[key] = String(value);
        });
    }
    const searchParams = new URLSearchParams(filtered);
    return fetchAPI(`/products/?${searchParams.toString()}`);
}

export async function getCategories() {
    // Correct endpoint: /categories/ (mapped to CategoryViewSet)
    return fetchAPI('/categories/');
}

export async function getProduct(slug: string) {
    // Ideally retrieve by slug. If backend expects ID, we might need a different approach.
    // Standard DRF router uses PK by default, but we can set lookup_field = 'slug' in ViewSet.
    // For now assuming slug lookup works or using ?slug= filter if needed.
    // If standard Router: /products/{pk}/.
    // If ViewSet has lookup_field='slug', then /products/{slug}/ works.
    return fetchAPI(`/products/${slug}/`);
}

export async function registerUser(data: RegisterData) {
    return fetchAPI('/auth/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function loginUser(data: LoginData) {
    return fetchAPI('/auth/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function getProfile() {
    return fetchAPI('/auth/me/');
}

export async function updateProfile(data: ProfileUpdateData) {
    return fetchAPI('/auth/me/', {
        method: 'PATCH', // or PUT
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function getCategory(slug: string) {
    const res = await fetchAPI(`/categories/?slug=${slug}`);
    return res.results?.[0] || res[0];
}

export async function getStories() {
    return fetchAPI('/stories/');
}
