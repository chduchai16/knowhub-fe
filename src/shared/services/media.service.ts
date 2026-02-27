import api from "@/shared/configs/axios.config";

export class MediaService {
    public static async uploadAvatar(image : File): Promise < string > {
        const formData = new FormData();
        formData.append('file', image);
        const response = await api.post('/medias/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    public static async uploadBackground(image : File): Promise < string > {
        const formData = new FormData();
        formData.append('file', image);
        const response = await api.post('/medias/background', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    public static async uploadTempImage(image : File): Promise < string > {
        const formData = new FormData();
        formData.append('file', image);
        const response = await api.post('/medias/temp', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }


    public static async updateTempImages(images: File[]): Promise<number[]> {
        const formData = new FormData();
        images.forEach(image => formData.append('files', image));
        const response = await api.post('/medias/temp/batch', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
}

