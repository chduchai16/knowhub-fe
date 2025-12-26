import { api } from "@/configs/axios.config";
import { LoginSchema } from "../schemas/login-schema";
import { RegisterSchema } from "../schemas/register-schema";

export class AuthService {

  static async login(loginRequest: LoginSchema) {
    try {
      const response = await api.post("/auth/login", loginRequest);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async register(registerRequest: RegisterSchema) {
    try {
      const response = await api.post("/auth/register", registerRequest);
      console.log("Register success", response.data);
      return response.data; 
    } catch (error: any) {
      console.error("Register failed", error.response?.data || error.message);
      throw error; 
    }
  }
}