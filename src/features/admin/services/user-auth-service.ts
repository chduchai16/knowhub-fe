import api from "@/configs/axios.config";

export class UserAuthService {

    static async getProfile(){
        try {
            const response = await api.get(`/users/profile`);
            return response.data;
        } catch (error) {
            throw error;
        }   
    }  
}