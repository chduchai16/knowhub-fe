import { api } from "@/configs/axios.config";
import { LoginSchema } from "../schemas/login-schema";
import { RegisterSchema } from "../schemas/register-schema";

export class AuthService {

  static async login(loginRequest: LoginSchema) {
    try {
      const response = await api.post("/auth/login", loginRequest);
      localStorage.setItem("token", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async register(registerRequest: RegisterSchema) {
    try {
      const response = await api.post("/auth/register", registerRequest);
      return response.data; 
    } catch (error: any) {
      throw error; 
    }
  }
}