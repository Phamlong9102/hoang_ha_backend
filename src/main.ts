import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS USE TO ENABLE DIFFRENT IP CAN USE API PATH
  app.enableCors();

  // SỬ DỤNG GLOBALPIPES ĐỂ VALIDATE FORM DATA GỬI LÊN TỪ USER
  app.useGlobalPipes(
    new ValidationPipe({
      // THẰNG WHITE LIST: TRUE THÌ BÊN BACK END CHỈ NHẬN NHỮNG DATA ĐÃ ĐƯỢC KHAI BÁO
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
