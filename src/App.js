import React, { useEffect, useState, useRef }from "react";
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

function App() {
  const googleApiRef = useRef(new GApi());
  const [isGApiReady, setIsGApiReady] = useState(false);

  useEffect(() => {
    googleApiRef.current.load({
      signInCb: signInCallback,
      stateUpdateCb: () => setIsGApiReady(true),
    });
  },[]);

  const signInCallback = () => {
    console.log("signInCallback");
    window.location.reload();
  }

  const handleClickSignIn = () => {
    googleApiRef.current.signIn();
  }

  const handleClickSignOut = () => {
    googleApiRef.current.signOut();
  }

  const renderUserInfo = () => {
    const { Fs: {lt: email, oT: name}, uc: { access_token, scope }} =  googleApiRef.current.currentUser
    return (
      <ul>
        <li>email: {email}</li>
        <li>name: {name}</li>
        <li>access_token: {access_token}</li>
        <li>scope: {scope}</li>
      </ul>
    )
  }

  return (
  <>
    implicit flow
    <StyledWrapper>
      {
      !googleApiRef.current.isSignedIn ? (
      <StyledDiv 
        isReady={isGApiReady}
        onClick={handleClickSignIn}
      >click me to signIn with google</StyledDiv>) :
      <StyledDiv onClick={handleClickSignOut}> 로그아웃하자! </StyledDiv>
    }</StyledWrapper>
    <StyledWrapper>
      {
        googleApiRef.current.isSignedIn &&
        renderUserInfo()
      }
    </StyledWrapper>
  </>
  );
}

export default App;
