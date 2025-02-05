import { getApp } from './app.js'
import type { AppConfig } from './shared/configs/app-config.js'

async function server() {
  const app = await getApp()

  app.listen(
    {
      port: app.diContainer.resolve<AppConfig>('appConfig').configurations.port,
      host: app.diContainer.resolve<AppConfig>('appConfig').configurations.bindAddress,
    },
    (err) => {
      if (err) {
        process.exit(1)
      }
    },
  )
}

server()
