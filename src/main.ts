declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
})();
