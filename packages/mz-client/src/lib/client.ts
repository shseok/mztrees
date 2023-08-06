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

// http error (not network error)
async function rejectIfNeeded(response: Response) {
  if (!response.ok) {
    const data = await response.json();
    throw new FetchError(response, data);
  }
}

export const fetchClient = {
  baseUrl:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL!
      : process.env.NEXT_PUBLIC_API_BASE_URL!,
  // baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
  async get<T>(url: string, config: RequestConfig = {}): Promise<T> {
    // const query = config?.params
    //   ? QueryString.stringify(config?.params, { addQueryPrefix: true })
    //   : "";
    const response = await fetch(this.baseUrl.concat(url), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: _cookie,
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
        Cookie: _cookie,
        ...(config.headers ?? {}),
      },
      signal: config.signal,
      body: body ? JSON.stringify(body) : JSON.stringify({}),
    });
    await rejectIfNeeded(response);

    // for reply.status(204) > json x > so, response.text() > type error > as any
    // 서버에서 reply.status(204)응답시 useMutation onSuccess 미동작 해결
    const data: T = response.headers.get("Content-Type")?.includes("json")
      ? await response.json()
      : ((await response.text()) as any);
    return data;
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
        Cookie: _cookie,
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
        Cookie: _cookie,
        ...(config.headers ?? {}),
      },
      signal: config.signal,
    });

    await rejectIfNeeded(response);

    // for reply.status(204) > json x > so, response.text() > type error > as any
    // 서버에서 reply.status(204)응답시 useMutation onSuccess 미동작 해결
    const data: T = response.headers.get("Content-Type")?.includes("json")
      ? await response.json()
      : ((await response.text()) as any);

    return data;
  },
};
