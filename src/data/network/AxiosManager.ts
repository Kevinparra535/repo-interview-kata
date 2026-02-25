import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { injectable } from 'inversify';

import { config } from '@src/config/config';
import { HttpManager, HttpRequestConfig } from '@src/domain/services/HttpManager';

@injectable()
export class AxiosManager implements HttpManager {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.BASE_URL,
      timeout: 15000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  async get<TResponse>(url: string, config?: HttpRequestConfig): Promise<TResponse> {
    try {
      const response = await this.client.get<TResponse>(url, this.toAxiosConfig(config));
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: HttpRequestConfig,
  ): Promise<TResponse> {
    try {
      const response = await this.client.post<TResponse>(url, body, this.toAxiosConfig(config));
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: HttpRequestConfig,
  ): Promise<TResponse> {
    try {
      const response = await this.client.put<TResponse>(url, body, this.toAxiosConfig(config));
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: HttpRequestConfig,
  ): Promise<TResponse> {
    try {
      const response = await this.client.patch<TResponse>(url, body, this.toAxiosConfig(config));
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async delete<TResponse>(url: string, config?: HttpRequestConfig): Promise<TResponse> {
    try {
      const response = await this.client.delete<TResponse>(url, this.toAxiosConfig(config));
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  private toAxiosConfig(config?: HttpRequestConfig): AxiosRequestConfig {
    return {
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
    };
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof AxiosError) {
      const responseMessage =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.response?.statusText;

      return new Error(responseMessage ?? error.message ?? 'Unexpected network error');
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error('Unexpected network error');
  }
}
