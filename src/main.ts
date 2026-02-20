import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE ?? "OBE API")
    .setDescription(process.env.SWAGGER_DESC ?? "")
    .setVersion(process.env.SWAGGER_VERSION ?? "1.0")
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, doc);
  
  await app.listen(Number(process.env.PORT ?? 4000));
}
bootstrap();