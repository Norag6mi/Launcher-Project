import apiClient from "../api/apiClient";

const authService = {

    async login(email, password) {

        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        try {

            const response = await apiClient.post(
                "/login",
                formData,
                {headers: {"Content-Type": "application/x-www-form-urlencoded"}}
            );
            return response.data;
        }
        catch(error){
            throw error;
        }
    }
};

export default authService;