const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const cors = require("@koa/cors");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = new Koa();

const router = new Router();

app.use(bodyParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

function getCodeAuthorizationLink(ctx){
  const host = "https://accounts.google.com/o/oauth2/v2/auth";
  const scopes = [
    "profile",
    "https://www.googleapis.com/auth/calendar",
  ]
  const queries = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: "http://localhost:3000/oauth_callback",
    response_type: "code",
    scope: `${scopes.join(" ")}`,
    access_type: "offline",
    state: "google",
    prompt: "select_account",
  }
  const link =  host + "?" + Object.entries(queries).reduce((acc, curr) => {
    return acc+ `${curr[0]}=${curr[1]}&`;
  },"");
  ctx.status = 200;
  ctx.body = link;
}

async function signIn(ctx){
  const {request: {body: { code }}} = ctx;
  try {
    const result = await fetch("https://oauth2.googleapis.com/token",{
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/oauth_callback",
        code,
      })
    });
    const resultJson = await result.json();
    const { access_token, id_token, refresh_token } = resultJson;
    console.log("access_token: ", access_token);
    console.log("id_token: ", id_token);
    const decodeResponse = jwt.decode(id_token);
    console.log("decodeResponse: ", decodeResponse);
    // console.log("resultJson: ", resultJson);
    
    ctx.cookies.set("practice", )
    ctx.status = 200;
    ctx.body = {access_token};
  }
  
  catch (e) {
    console.error(e);    
  }
}

router.get("/api/codeLink", getCodeAuthorizationLink);
router.post("/api/signIn", signIn);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server listen on ${port}port`);
})
