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
  useEffect(() => {
    googleApiRef.current.load();
  },[])
  const handleGoogleLogin = async () => {
    try{
      const googleApi = googleApiRef.current;
      const code = await googleApi.authorize();
      console.log("code: ", code);
      const access_token = await googleApi.exchangeCodeToToken(code);
      setToken(access_token);
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