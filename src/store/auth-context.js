import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
    token : '',
    isLoggedIn : false,
    login(token){},
    logout (){},
});

const calculateRemainingTime = (expirationTime) =>{
    const currentTime = new Date().getTime(); // gets in milliseconds
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remaingDuration = adjExpirationTime - currentTime; 

    return remaingDuration;
}

const retriveStoredToken = () => {
    const  storedToken =  localStorage.getItem('token');
    const  storedExpirationDate=  localStorage.getItem('expirationTime');

    const remaingTime = calculateRemainingTime(storedExpirationDate);

    // Logout if the remaining time is negative or less than a minute
    if(remaingTime <= 60000){
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return { token: storedToken, duration: remaingTime };
}

export const AuthContextProvider = (props) =>{
    const tokenData = retriveStoredToken();
    
    let initalToken
    if(tokenData) {
        initalToken = tokenData;
    }
    const [token,setToken] = useState(initalToken);

    const userIsLoggedIn = !!token; // Converts to a truthy or falsy value


    const logoutHandler = useCallback(() =>{
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    },[]);

    const loginHandler = (token, expirationTime) =>{
        setToken(token);
        localStorage.setItem('token',token);
        localStorage.setItem('expirationTime',expirationTime);

        const remaingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remaingTime);
    };

    useEffect(()=>{
        if(tokenData){
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler,tokenData.duration)
        }
    },[tokenData,logoutHandler]);

    const contextValue = {
        token : token,
        isLoggedIn : userIsLoggedIn,
        login : loginHandler,
        logout : logoutHandler,
    }

    return (
      <AuthContext.Provider value={contextValue}>
        {props.children}
      </AuthContext.Provider>
    );
}


export default AuthContext;
