import { api } from "@/shared/configs/axios.config";
import { LoginSchema } from "../schemas/login-schema";
import { RegisterSchema } from "../schemas/register-schema";
import Cookies from "js-cookie";

export class AuthService {

  static async login(loginRequest: LoginSchema) {
    try {
      const response = await api.post("/auth/login", loginRequest);
      Cookies.set("token", response.data, {
        expires: 1, // 1 ngày
        secure: true,
        sameSite: "Strict",
      });
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