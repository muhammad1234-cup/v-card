import { storage } from './storage';
import { AuthResponse, CompanySettings, Employee, AnalyticsStats } from '../types';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = storage.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'Network error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/me');
  }

  // Public Cards
  async getPublicCard(slug: string): Promise<{ employee: Employee; company: CompanySettings }> {
    return this.request<{ employee: Employee; company: CompanySettings }>(`/api/public/cards/${slug}`);
  }

  async trackCardAction(slug: string, action: 'scan' | 'vcard'): Promise<void> {
    try {
      await fetch(`/api/public/cards/${slug}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
    } catch {
      // Non-blocking telemetry
    }
  }

  // Admin APIs
  async getAdminStats(): Promise<AnalyticsStats> {
    return this.request<AnalyticsStats>('/api/admin/stats');
  }

  async getEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('/api/admin/employees');
  }

  async getEmployee(id: string): Promise<Employee> {
    return this.request<Employee>(`/api/admin/employees/${id}`);
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    return this.request<Employee>('/api/admin/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    return this.request<Employee>(`/api/admin/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/employees/${id}`, {
      method: 'DELETE',
    });
  }

  async getCompanySettings(): Promise<CompanySettings> {
    return this.request<CompanySettings>('/api/admin/company');
  }

  async updateCompanySettings(data: Partial<CompanySettings>): Promise<CompanySettings> {
    return this.request<CompanySettings>('/api/admin/company', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Employee Self-Service APIs
  async getMyProfile(): Promise<{ employee: Employee; company: CompanySettings }> {
    return this.request<{ employee: Employee; company: CompanySettings }>('/api/employee/profile');
  }

  async updateMyProfile(data: Partial<Employee>): Promise<Employee> {
    return this.request<Employee>('/api/employee/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateNfcStatus(tagId: string, writeStatus: 'written' | 'pending'): Promise<Employee> {
    return this.request<Employee>('/api/employee/nfc', {
      method: 'POST',
      body: JSON.stringify({ tagId, writeStatus }),
    });
  }

  // Upload (Avatar / Logo)
  async uploadFile(base64Data: string, fileName?: string): Promise<{ url: string }> {
    return this.request<{ url: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ image: base64Data, fileName }),
    });
  }
}

export const api = new ApiClient();
