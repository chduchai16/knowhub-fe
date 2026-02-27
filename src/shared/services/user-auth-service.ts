import api from "@/shared/configs/axios.config";

export class UserAuthService {

    static async getProfile() {
        const response = await api.get(`/users/profile`);
        return response.data;
    }
}