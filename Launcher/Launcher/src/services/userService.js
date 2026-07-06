import { jwtDecode } from "jwt-decode";
import tokenService from "./tokenService";

const userService = 
{
    getUser()
    {
        const token = tokenService.getToken();

        if(!token)
            return null;
        try{

            return jwtDecode(token);
        }
        catch{

            return null;
        }
    }
};

export default userService;