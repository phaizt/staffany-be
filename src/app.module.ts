import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShiftModule } from './shift/shift.module';

@Module({
  imports: [ShiftModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
