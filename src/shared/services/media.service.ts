import api from "@/shared/configs/axios.config";

export class MediaService {
    public static async uploadAvatar(image : File): Promise < string > {
        try {
            const formData = new FormData();
            formData.append('file', image);
            const response = await api.post('/medias/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async uploadBackground(image : File): Promise < string > {
        try {
            const formData = new FormData();
            formData.append('file', image);
            const response = await api.post('/medias/background', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async uploadTempImage(image : File): Promise < string > {
        try {
            const formData = new FormData();
            formData.append('file', image);
            const response = await api.post('/medias/temp', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
