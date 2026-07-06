const tokenService = {

    saveToken(token){
        localStorage.setItem("access_token", token);
    },

    getToken(){

        return localStorage.getItem("access_token");
    },

    removeToken(){
        localStorage.removeItem("access_token");
    }

};

export default tokenService;