/*import React, { useState } from 'react'
import './LoginSignup.css'


import user_icon from '../Assests/person.png'
import email_icon from '../Assests/email.png'
import password_icon from '../Assests/password.png'

const LoginSignup = () => {

    const [action,setAction] = useState("Login");

    return (
        <div className='container'>
         <div className ="header">
          <div className ="text">{action}</div>    
          <div className="underline"></div>
            </div>
            <div className="inputs">
                {action==="Login"?<div></div>:<div className="input">
             <img src={user_icon} alt=""/>
             <input type="text" placeholder = "Name"/>    
                  </div>}
                    <div className="input">
                <img src={email_icon} alt=""/>
                <input type="email" placeholder = "Email ID"/>    
                    </div>  
                    <div className="input">
                <img src={password_icon} alt=""/>
                <input type="password" placeholder = "Password"/>    
                    </div>  
                    </div>    
                    {action==="Sign Up"?<div></div>:<div className="forgot-password">Lost Password? <span>Click Here!</span></div>}  
                <div className="submit-container">
                  <div className={action==="Login"?"submit gray":"submit"} onClick = {()=>{setAction("Sign Up")}}>Sign Up
                    <div className={action==="Sign Up"?"submitgray":"submit"}onClick = {()=>{setAction("Login")}}>Login
                        </div>
                        </div>  
                </div>
        </div> 
    );
};

export default LoginSignup; 
*/

import React, { useState } from 'react';
import './LoginSignup.css';

import user_icon from '../Assests/person.png';
import email_icon from '../Assests/email.png';
import password_icon from '../Assests/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Login");

    return (
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Login" ? null : (
                    <div className="input">
                        <img src={user_icon} alt="User Icon" />
                        <input type="text" placeholder="Name" />
                    </div>
                )}
                <div className="input">
                    <img src={email_icon} alt="Email Icon" />
                    <input type="email" placeholder="Email ID" />
                </div>
                <div className="input">
                    <img src={password_icon} alt="Password Icon" />
                    <input type="password" placeholder="Password" />
                </div>
            </div>
            {action === "Sign Up" ? null : (
                <div className="forgot-password">
                    Lost Password? <span>Click Here!</span>
                </div>
            )}
            <div className="submit-container">
                {/* Sign Up Button */}
                <div
                    className={action === "Sign Up" ? "submit active" : "submit"}
                    onClick={() => setAction("Sign Up")}
                >
                    Sign Up
                </div>
                {/* Login Button */}
                <div
                    className={action === "Login" ? "submit active" : "submit"}
                    onClick={() => setAction("Login")}
                >
                    Login
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
