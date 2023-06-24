// export function setClientCookie(cookie: string) {
//   client.defaults.headers.common['Cookie'] = cookie
// }
import QueryString from "qs";

interface RequestConfig {
  params?: any;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export const fetchClient = {
  baseUrl: "http://localhost:4000",
  async get<T>(pathUrl: string, config: RequestConfig = {}): Promise<T> {
    const query = config?.params
      ? QueryString.stringify(config?.params, { addQueryPrefix: true })
      : "";

    const response = await fetch(this.baseUrl.concat(pathUrl, query), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Cookie: _cookie,
        ...(config?.headers ?? {}),
      },
    });

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
    return response.json();
  },
  async patch<T>(url: string, body: any, config: RequestConfig = {}) {
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
    return response.json();
  },
  async delete<T>(url: string, config: RequestConfig = {}) {
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

    return response.json();
  },
};
