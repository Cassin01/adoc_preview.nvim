import Server from "./server.ts";

// import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";
import { Denops } "./deps.ts";

export async function main(denops: Denops): Promise<void> {
    denops.dispatcher = {
        async core(arg: unknown): Promise<void> {
            await Server.setup();
        }
    }
}
