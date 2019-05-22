const Koa = require("koa");
const cors = require("koa2-cors")
const router = require("koa-router")();
const koaBody = require('koa-body');
const WebSocket = require('ws');

const app = new Koa();
const wss = new WebSocket.Server({port: 8088});

app.use(cors())

router.post("/upload_application_config/", koaBody(), async (ctx, next) => {
  await next();
  // console.log("upload_application_config@", JSON.stringify(ctx.request.body));
  ctx.body = "success";
  let data = {}
  data.type = "websocket_client"
  data.config = JSON.stringify(ctx.request.body)
  wss.broadcast(JSON.stringify(data));
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each (client) {
    if(client.readyState == WebSocket.OPEN){
      client.send(data);
    }
  })
}

wss.on('connection', ws => {
  global._ws = ws
  ws.onmessage = function(e) {
    let data = {}
    data.type = "browser_client"
    data.config = e.data
    wss.broadcast(JSON.stringify(data))
    // console.log("onMessage: ", e.data)
  }
})


// app.use(serve(path.join(__dirname, "./src")))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(7000, () => {
  console.log("starting at port 7000")
})