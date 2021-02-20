const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const cors = require("@koa/cors");

dotenv.config();

const app = new Koa();

const router = new Router();

app.use(bodyParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

async function signIn(ctx){
  const {request: {body: {code}}} = ctx;
  console.log("code: ", code);
  try {
    const result = await fetch("https://oauth2.googleapis.com/token",{
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        redirect_uri: "http://localhost:3001/api/signIn",
        grant_type: "authorization_code",
        code,
      })
    });
    const { access_token } = await result.json();
    ctx.status = 200;
    console.log("access_token: ", access_token);
    ctx.body = access_token;
  }
  catch (e) {
    console.error(e);    
  }
  
  
}

router.post("/api/signIn", signIn)

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server listen on ${port}port`);
})
