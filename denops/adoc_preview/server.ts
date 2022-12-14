// import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
// import { readFileStr } from "https://deno.land/std@0.55.0/fs/read_file_str.ts";
// import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
// import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.1/mod.ts";
import { serve, readFileStr, Server, EventEmitter } from "./deps.ts";

const addr = ":8080";
// console.log(`HTTP server listening on http://localhost${addr}`);
//
type Events = {
  cursorMoved(): void;
}

const _bundled_adoc = Deno.readTextFileSync(
  new URL("./routes/sock.js", import.meta.url),
);
const _main_body = Deno.readTextFileSync(
  new URL("./routes/index.html", import.meta.url),
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

async function events() {
    const events = new EventEmitter<Events>();
}

class Core {
  async handler(req: Request) {
    const req_g = req_cnd(req, "GET");
    if (req_g("/")) {
      // console.log((new URLPattern(req.url)).pathname)
      return new Response(_main_body, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    } else if (req_g("/ws")) {
      const { socket, response } = Deno.upgradeWebSocket(req);
      this._socket = socket;
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

  private _socket: unknown;
  async cursor_moved(arg: unknown) {
    if (this._socket === undefined) {
      console.log(arg);
      this._socket.send(JSON.stringify({
        bufname: "hoge",
        cursorLine: arg,
      }));
    }
  };
  async setup() {
    await serve(
      await this.handler,
      { addr },
    );
  };
}

export default Core;

// function _test() {
//   console.log(Deno.cwd());
// }
// _test();
