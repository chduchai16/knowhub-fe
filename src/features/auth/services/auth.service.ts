import { api } from "@/shared/configs/axios.config";
import { LoginSchema } from "../schemas/login-schema";
import { RegisterSchema } from "../schemas/register-schema";
import Cookies from "js-cookie";
import { JwtPayload } from "@/shared/models/jwt-payload";
import { jwtDecode } from "jwt-decode";


export class AuthService {

  static async login(loginRequest: LoginSchema) {
    try {
      const response = await api.post("/auth/login", loginRequest);
      const token = response.data;

      const decoded = jwtDecode<JwtPayload>(token);

      const expiresAt = new Date(decoded.exp * 1000);

      Cookies.set("token", token, {
        expires: expiresAt,   
        secure: false,      
        sameSite: "Lax",
        path: "/",
      });

      return token;
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