import { api } from './api';

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
}

export interface CreateUserResult extends UserItem {
  tempPassword: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  roleId?: string;
  isActive?: boolean;
}

export const usersService = {
  list: (page: number, limit: number) =>
    api
      .get<{ success: boolean; data: UserItem[]; pagination: { totalPages: number; page: number } }>('/users', {
        params: { page, limit },
      })
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),

  create: (payload: CreateUserPayload) =>
    api.post<{ success: boolean; data: CreateUserResult }>('/users', payload).then((res) => res.data.data),

  update: (id: string, payload: UpdateUserPayload) =>
    api.put<{ success: boolean; data: UserItem }>(`/users/${id}`, payload).then((res) => res.data.data),

  getRoles: () => api.get<{ success: boolean; data: Role[] }>('/roles').then((res) => res.data.data),
};