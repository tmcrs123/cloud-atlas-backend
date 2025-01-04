import { getApp } from "./app";

async function server() {
  const app = await getApp();

  app.listen({ port: 3000 }, (err, address) => {
    if (err) console.log(err, address);
  });
}

server();
