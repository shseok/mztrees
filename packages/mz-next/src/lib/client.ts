import QueryString from "qs";

let _cookie = "";

export function setClientCookie(cookie: string) {
  _cookie = cookie;
}

interface RequestConfig {
  params?: any;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export class FetchError extends Error {
  constructor(public response: Response, public data: any) {
    super(`Fetch failed with status ${response.status}`);
  }
}

async function rejectIfNeeded(response: Response) {
  if (!response.ok) {
    const data = await response.json();
    throw new FetchError(response, data);
  }
}

export const fetchClient = {
  baseUrl: "http://localhost:4000",
  async get<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const query = config?.params
      ? QueryString.stringify(config?.params, { addQueryPrefix: true })
      : "";
    const response = await fetch(this.baseUrl.concat(url, query), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Cookie: _cookie,
        ...(config?.headers ?? {}),
      },
    });
    await rejectIfNeeded(response);
    return response.json();
  },
  async post<T>(
    url: string,
    body?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const response = await fetch(this.baseUrl.concat(url), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Cookie: _cookie,
        ...(config.headers ?? {}),
      },
      signal: config.signal,
      body: body ? JSON.stringify(body) : undefined,
    });
    await rejectIfNeeded(response);
    return response.json();
  },
  async patch<T>(
    url: string,
    body: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const response = await fetch(this.baseUrl.concat(url), {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Cookie: _cookie,
        ...(config.headers ?? {}),
      },
      signal: config.signal,
      body: JSON.stringify(body),
    });
    await rejectIfNeeded(response);

    return response.json();
  },
  async delete<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const response = await fetch(this.baseUrl.concat(url), {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Cookie: _cookie,
        ...(config.headers ?? {}),
      },
      signal: config.signal,
    });

    await rejectIfNeeded(response);

    return response.json();
  },
};
