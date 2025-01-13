import { getApp } from "./app.js";
import { AppConfig } from "./shared/configs/index.js";

async function server() {
  const app = await getApp();

  app.listen(
    {
      port: app.diContainer.resolve<AppConfig>("appConfig").port,
      host: app.diContainer.resolve<AppConfig>("appConfig").bindAddress,
    },
    (err, address) => {
      if (err) console.log(err, address);
    }
  );
}

server();
