import { useState, useRef, useContext } from 'react';
import { useHistory } from "react-router-dom";

import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event)=>{
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    
    // optional : Add Validation

    let url;

    if (isLogin) {
      setIsLoading(true);
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDtTvhZwRkMUvl28Qi5QZBRZqKPHnrJZms';
    }

    else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDtTvhZwRkMUvl28Qi5QZBRZqKPHnrJZms';
    }

    setIsLoading(true);

    fetch(url,
    {
      method : 'POST',
      body : JSON.stringify({
        email : enteredEmail,
        password : enteredPassword,
        returnSecureToken : true,
      }),
      headers : {
        'Content-Type' : 'application/json'
      },
    }).then(res =>{
      setIsLoading(false);
      if (res.ok) {
        return res.json()
      }
      else{return res.json().then(data =>{
        console.log(data);
        let errorMessage= 'Authentication Failed!';
        if(data?.error?.message){
          errorMessage = data?.error?.message;
        }
        
        throw new Error(errorMessage) 
      })}
    })
    .then(data =>{

      // Setting Expiration Time
      const expirationTime = new Date(
        new Date().getTime() + (+data.expiresIn*1000) 
      );

      // Handling the Login
      authCtx.login(data.idToken,expirationTime.toISOString());
      history.replace('/');
    })
    .catch(error => alert(error.message) )
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          {isLoading && <p>Is Sending Request</p>}
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
