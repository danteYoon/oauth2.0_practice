import React, {useRef, useEffect, useState } from "react";
import styled from "styled-components";

import GApi from "./utils/gapi";

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledDiv = styled.div`
  display: flex;
  background-color: ${({isReady}) => isReady ? "green" : "gray"};
  justify-content: center;
  align-items: center;
  text-align:center;
  width: 150px;
  height: 70px;
  cursor: pointer;
`;

const CodeFlow = ({ googleApi }) => {
  const [token ,setToken] = useState(null);
  const googleApiRef = useRef(new GApi())

  const messageEventHandler = event => {
    console.log("event.data: ", event.data);
  }

  useEffect(() => {
    window.addEventListener("message", messageEventHandler,false);

    return () => {
      window.removeEventListener("message", messageEventHandler);
    }
  },[]);

  useEffect(() => {
    googleApiRef.current.load();
  },[])

  const handleGoogleLogin = async () => {
    
    try{
      const response = await fetch(
        "http://localhost:3001/api/codeLink",
        {
          headers: {
            "Content-Type": "text/html;"
          }
        }
      );
      const link = await response.text();
      
      new Promise(resolve => {
        const win = window.open(
          link, 
          "googleLogin",
        );
        
      })
      return false;
    } catch(error) {
      console.error(error);
    }
  }
  return(
    <>
      <StyledWrapper>
        <StyledDiv onClick={handleGoogleLogin}>code flow 구글 로그인</StyledDiv>
      </StyledWrapper>
      <StyledWrapper>
        <>
        {token && `access_token: ${token}`}
        </>
    </StyledWrapper>
    </>
  )
}

export default CodeFlow;