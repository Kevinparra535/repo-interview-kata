export type HttpRequestConfig = {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
};

export interface HttpManager {
  get<TResponse>(url: string, config?: HttpRequestConfig): Promise<TResponse>;
  post<TResponse, TBody = unknown>(url: string, body?: TBody, config?: HttpRequestConfig): Promise<TResponse>;
  put<TResponse, TBody = unknown>(url: string, body?: TBody, config?: HttpRequestConfig): Promise<TResponse>;
  patch<TResponse, TBody = unknown>(url: string, body?: TBody, config?: HttpRequestConfig): Promise<TResponse>;
  delete<TResponse>(url: string, config?: HttpRequestConfig): Promise<TResponse>;
}
