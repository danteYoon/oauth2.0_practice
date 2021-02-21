import React, { useEffect } from "react";
import GApi from "./utils/gapi";

const AuthCallback = ({location}) => {
  const queries = new URLSearchParams(location.search);
  const gapi = new GApi();

  useEffect(async () => {
    try{
      const userInfo = await gapi.exchangeCodeToToken(queries.get("code"));
      window.opener.postMessage({
        type: "userInfo",
        userInfo,
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