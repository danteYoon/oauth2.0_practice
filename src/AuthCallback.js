import React, { useEffect } from "react";
import GApi from "./utils/gapi";

const AuthCallback = ({location}) => {
  const queries = new URLSearchParams(location.search);
  const gapi = new GApi();

  useEffect(async () => {
    try{
      const access_token = await gapi.exchangeCodeToToken(queries.get("code"));
      console.log("access_token: ", access_token);
      window.opener.postMessage({
        type: "token",
        access_token: access_token,
      }, window.location.origin + "/codeflow");
    } catch (error){
      window.opener.postMessage({
        type: "error",
        message: "No Access Token Found",
      }, window.location.origin + "/codeflow");
    }
    window.close();
  },[]);

  return (
    <>
      로그인 중입니다...
    </>
  )
}

export default AuthCallback;