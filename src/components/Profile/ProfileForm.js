import classes from './ProfileForm.module.css';

import { useContext, useRef } from "react";
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {

  const history = useHistory();
  const newPasswordRef = useRef();
  const authCtx = useContext(AuthContext);

  const onSubmitHandler = async (event) =>{
    event.preventDefault()
    const token = authCtx.token;
    const newPassword = newPasswordRef.current.value;

    // addValidation
    const responce = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDtTvhZwRkMUvl28Qi5QZBRZqKPHnrJZms`,
    {
      method : 'POST',
      body : JSON.stringify({
        idToken : token,
        password : newPassword,
        returnSecureToken : false,
      }),
      headers : {
        'Content-Type' : 'application/json'
      },      
    })
  
    if (!responce.ok) {
      return alert('Error')
    }

    history.replace('/')


  
  
  }

  return (
    <form className={classes.form} onSubmit={onSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={newPasswordRef} type='password' id='new-password' minLength="7"/>
      </div>
      <div className={classes.action}>
        <button >Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
