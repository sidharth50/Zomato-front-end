import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { useState } from "react";
import { checkLogin } from "./base_url";

let Header = () => { 
  
    const navigate = useNavigate();
    
    let [isLogin, setIsLogin] = useState(checkLogin());
    let success = credentialResponse => {
        try{
          let token = credentialResponse.credential;
          // save token
          localStorage.setItem('auth_token', token);
          window.location.assign("/");
            token = jwtDecode(token);
            console.log(token);
        }catch(error){
            alert('wrong token');
        }
        //console.log(credentialResponse.credential);  // credential JWT Token
        // JSON WEB TOKEN
        // Header + Payload(data) + Signature
        // jwt-decode
      };
      let error = () => {
        console.log('Login Failed');
      };
      let logout = () => {
        localStorage.removeItem("auth_token");
        window.location.assign('/');
      }
   return( <>
   <GoogleOAuthProvider clientId="596816129630-bg5asks1ks98at6pu64fjsluqeko1pss.apps.googleusercontent.com">
        <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Login</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <GoogleLogin
  onSuccess={success}
  onError={error}
  />
      </div>
      
    </div>
  </div>
</div>
      <div className="col-10 d-flex justify-content-end py-2">
        
        <div>
            {
                isLogin ? <><img src ={isLogin.picture} className="user-logo ms-1"/><span className="text-white mx-3">Welcome {isLogin.given_name}</span>
                <button className="btn btn-sm btn-danger" onClick={logout}>Logout</button>
                </> : (<><button className="btn text-white" data-bs-target = "#loginModal" data-bs-toggle = "modal">Login</button>
                <button className="btn btn-outline-light">
                  <i className="fa fa-search" aria-hidden="true"></i>Create a Account
                </button></>)
            }
          
        </div>
      </div>
      </GoogleOAuthProvider>
    </>
   );
}

export default Header;