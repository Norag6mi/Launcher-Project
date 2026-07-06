import apiClient from "../api/apiClient";

const registerService = 
{
    async register(username, email, password) 
    {
        const response = await apiClient.post("/register", {username, email, password});

        return response.data;
    }
};

export default registerService;