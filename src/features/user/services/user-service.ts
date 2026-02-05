import api from '@/shared/configs/axios.config';
import { User } from '../models/user';
import { PageResponse } from '@/shared/models/page-response';

export class UserService {
  static async getPagedUsers(params: { page?: number; limit?: number; keyword?: string; roleId?: number; userStatus?: string }): Promise<PageResponse<User>> {
    const response = await api.get('/users', { params });
    return response.data;
  }

  static async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  static async getUserProfile(username: string): Promise<User> {
    const response = await api.get(`/users/search/username/${username}`);
    return response.data;
  }

  static async getCurrentUserProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.data;
  }

  static async searchUsers(query: string): Promise<User[]> {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data;
  }

  static async followUser(userId: number): Promise<number> {
    const response = await api.post(`/users/follow/${userId}`);
    return response.data;
  }

  static async unfollowUser(userId: number): Promise<number> {
    const response = await api.delete(`/users/unfollow/${userId}`);
    return response.data;
  }

  static async updateProfile(user: Partial<User>): Promise<User> {
    const response = await api.put('/users', user);
    return response.data;
  }

  static async createUser(user: Partial<User>): Promise<User> {
    const response = await api.post('/users', user);
    return response.data;
  }

  static async updateUser(user: Partial<User>): Promise<User> {
    const response = await api.put('/users', user);
    return response.data;
  }

  static async searchUsersByName (keyword : string ): Promise<User[]> {
    const response = await api.get(`/users/search/${keyword}`);
    return response.data;
  }

  static async deleteUser(id: number | string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}
