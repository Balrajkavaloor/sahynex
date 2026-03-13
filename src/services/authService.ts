import { api } from './api';

export interface LoginResult {
  access_token: string;
  token_type: string;
}

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const res = await api.post('/auth/login', { email, password });
  // Backend wraps in { success, data, message }
  return res.data.data as LoginResult;
};

