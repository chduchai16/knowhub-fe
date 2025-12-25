import { api } from "@/configs/axios.config";
import { LoginSchema } from "../schemas/login-schema";
import { RegisterSchema } from "../schemas/register-schema";

export class AuthService {

    static async login(loginRequest : LoginSchema) {
        api.post("/auth/login", loginRequest)
        .then((response) => {
          localStorage.setItem("token", response.data);
        })
    }

    static async register(registerRequest : RegisterSchema) {
        api.post("/auth/register", registerRequest)
        .then((response) => {
          console.log("register success", response.data);
        })
    }
}