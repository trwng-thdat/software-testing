export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category_id: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
}

export async function fetchProducts(apiUrl: string, search?: string): Promise<Product[]> {
  const url = search
    ? `${apiUrl}/api/products?search=${encodeURIComponent(search)}`
    : `${apiUrl}/api/products`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API returned ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`Unexpected API response format: expected array, got ${typeof data}`);
  }
  return data;
}

export async function fetchProductsRaw(apiUrl: string, search?: string): Promise<Response> {
  const url = search
    ? `${apiUrl}/api/products?search=${encodeURIComponent(search)}`
    : `${apiUrl}/api/products`;
  return fetch(url);
}

export interface LoginResponse {
  token: string;
  user: { id: number; role: string };
}

export async function loginUser(apiUrl: string, email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${apiUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as LoginResponse;
  return data;
}

export async function addToCartApi(apiUrl: string, token: string, item: CartItem): Promise<Response> {
  return fetch(`${apiUrl}/api/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(item),
  });
}

export async function getCartApi(apiUrl: string, token: string): Promise<Response> {
  return fetch(`${apiUrl}/api/cart`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function createCategoryApi(apiUrl: string, token: string, name: string): Promise<Response> {
  return fetch(`${apiUrl}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name }),
  });
}

export async function getCategoriesApi(apiUrl: string, token?: string): Promise<Category[]> {
  const response = await fetch(`${apiUrl}/api/categories`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`GET /api/categories returned ${response.status}`);
  }
  const data = (await response.json()) as Category[];
  return data;
}

export async function updateCategoryApi(apiUrl: string, token: string, id: number, name: string): Promise<Response> {
  return fetch(`${apiUrl}/api/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
}

export async function deleteCategoryApi(apiUrl: string, token: string, id: number): Promise<Response> {
  return fetch(`${apiUrl}/api/categories/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
