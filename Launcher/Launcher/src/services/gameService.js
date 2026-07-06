import apiClient from "../api/apiClient";
import tokenService from "./tokenService";

const gameService = {

    async getGames() {
        const token = tokenService.getToken();
        try {
            const response = await apiClient.get("/games", {headers: {Authorization: `Bearer ${token}`}});

            return response.data;
        }
        catch(error){

            throw error;

        }

    }

};

export default gameService;