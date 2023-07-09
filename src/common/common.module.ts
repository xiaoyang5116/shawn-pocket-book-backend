import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guards/login.guard';

@Module({
  providers: [{ provide: APP_GUARD, useClass: LoginGuard }],
})
export class CommonModule {}
