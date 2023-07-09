import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 过滤未定义的参数
      forbidNonWhitelisted: true, // 设置不能有未定义的参数, 有则报错
      transform: true, // 自动参数装换类型, 转换成对应的类型
      transformOptions: {
        enableImplicitConversion: true, // 全局隐式类型转换，和修饰符 @Type(() => Number..) 行为相同，启用后，就不用再手动使用 @Type() 修饰符显示指定类型
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
