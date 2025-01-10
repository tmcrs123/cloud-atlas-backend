import { getApp } from "./app";
import { AppConfig } from "./shared/configs";

async function server() {
  const app = await getApp();

  app.listen(
    { port: app.diContainer.resolve<AppConfig>("appConfig").port },
    (err, address) => {
      if (err) console.log(err, address);
    }
  );
}

server();
