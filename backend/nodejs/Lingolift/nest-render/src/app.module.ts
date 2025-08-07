import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [TeacherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
