const scopes = [
  "profile",
  "https://www.googleapis.com/auth/calendar",
]
const discoveryDocs = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
]

class GoogleApi {
  gapi;
  client;
  auth2;
  calendar;
  authInstance;
  
  constructor(){
    this.gapi = window.gapi;
    this.authInstance = null;
  }

  updateAuthInstance(instance) {
    this.authInstance = instance;
  }

  get isSignedIn(){
    if(this.authInstance){
      return this.authInstance.isSignedIn.get();
    }
    return false;
  }

  get currentUser(){
    if(this.authInstance){
      return this.authInstance.currentUser.get();
    }
    return null;
  }

  get getGApi(){
    return this.gapi;
  }
  /**
   * @param {stateUpdateCb: Function, signInCb: Function} cb 
   */
  load(cb){
    this.gapi.load("client:auth2", () => {
      this.client = this.gapi.client;
      this.auth2 = this.gapi.auth2;
      if(cb){
      this.init(cb)
      }
    });
  }
  /**
   * @param {stateUpdateCb: Function, signInCb: Function} cb 
   */
  init(cb){
    this.client.init({
      apiKey: process.env.REACT_APP_API_KEY,
      clientId: process.env.REACT_APP_CLIENT_ID,
      scope: scopes.join(" "),
      discoveryDocs,
      redirectUri: "http:localhost:3001/api/signIn"
    }).then(() => {
      this.calendar = this.gapi.client.calendar;
      this.updateAuthInstance(this.gapi.auth2.getAuthInstance());
      if(cb){
        const{ stateUpdateCb, signInCb } = cb;
        stateUpdateCb();
        this.authInstance.isSignedIn.listen(signInCb);
      }
    })     
  }
  
  signIn(){
    if(this.authInstance){
      this.authInstance.signIn();
    }
  }
  
  signOut(){
    if(this.authInstance){
      this.authInstance.signOut();
      window.location.reload();
    }
  }

  async exchangeCodeToToken(code){
    try{
      const result = await fetch("http://localhost:3001/api/signIn", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          code, 
        }),
      })
      console.log("result: ", result);
      const { access_token } = result;
      return access_token;
    } catch(error){
      console.error(error);
    }
  }

  async authorize(){
    if(this.auth2){
      return new Promise((resolve, reject) =>{
        try {
          this.auth2.authorize({
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
            response_type: "code",
            redirect_uri: "postmessage",
            scope: "profile https://www.googleapis.com/auth/calendar",
          },(response) => {
            resolve(response.code);
          });
        } catch(error){
          reject(error);
          console.error(error);
        }
      }).then((value) => value);
    }
  }
}

export default GoogleApi;