import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { readFileStr } from "https://deno.land/std@0.55.0/fs/read_file_str.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";

async function getHtml(): Promise<any> {
  const html = await readFileStr(
    "./adoc_preview/routes/index.html",
    {
      encoding: "utf8",
    },
  ).catch((err) => {
    console.log(err);
    return "failed to read a file";
  });

  return { html };
}

const addr = ":8080";
// console.log(`HTTP server listening on http://localhost${addr}`);

const _bundled_adoc = Deno.readTextFileSync(
  new URL("./adoc_preview/routes/sock.js", import.meta.url),
);

const io = new Server();
io.on("", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.emit("hello", "world");

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

function req_cnd(req: Request, method) {
  return (path) => {
    return req.method === method && (new URLPattern(req.url)).pathname === path;
  }
}

const html = await getHtml();
// const jss = await getJs();
async function handler(req: Request) {
  const req_g = req_cnd(req, "GET");
  if (req_g("/")) {
    // console.log((new URLPattern(req.url)).pathname)
    return new Response(html.html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } else if (req_g("/ws")) {
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.onopen = () => {
      console.log("socket open");
      socket.send(JSON.stringify({
        bufname: "hoge",
        cursorLine: 3
      }));
    };
    socket.onclose = () => {
      console.log("a socket closed");
    };
    socket.onmessage = (msg) => {
      console.log("socket message:" + msg);
    };
    socket.addEventListener("message", function (event) {
      console.log(event);
    });
    return response;
  } else if (req_g("/sock.js")) {
    return new Response(_bundled_adoc_js, {
      headers: { "content-type": "text/javascript; charset=utf-8" },
    });
  } else {
    console.log("request url:" + req.url);
    return new Response("404 Not Found", { status: 404 });
  }
}

const server = {
    setup : async () => {
      await serve(
        await handler,
        { addr },
      );
    }
}

export default server;

function _test() {
  console.log(Deno.cwd());
}
_test();
