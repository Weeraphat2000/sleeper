import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { log } from 'console';
import { UserDocument } from '../models';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  log('getCurrentUserByContext', context.switchToHttp().getRequest().user);
  return context.switchToHttp().getRequest().user;
};

// สร้าง decorator ที่ชื่อว่า CurrentUser โดยใช้ createParamDecorator จาก @nestjs/common เพื่อใช้ในการดึงข้อมูล user ที่ผ่านการ verify จาก Passport มาใช้งาน แล้วเอาไปใช้ใน function ต่างๆ ใน controller ได้
// decorator จะได้ค่าจาก request.user ถ้าเอาไปใช้ใช้จะได้ค่าจาก request.user
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
