import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { log } from 'console';
import { UserDocument } from '../models';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  // 1) ตรวจสอบว่า context ตอนนี้เป็น type 'http' หรือไม่
  // 2) ถ้าใช่ ให้ใช้ context.switchToHttp().getRequest().user
  if (context.getType() == 'http') {
    log(
      'getCurrentUserByContextHttp',
      context.switchToHttp().getRequest().user,
    );
    return context.switchToHttp().getRequest().user;
  }

  // 3) ถ้าไม่ใช่กรณี 'http' เช่น อาจเป็น GraphQL resolver context เป็นต้น
  //    ลองดึงข้อมูล user ออกมาจาก argument ลำดับที่ 2 (index 2) ของ context
  //    context.getArgs()[2] มักจะเป็นตัว resolver info หรือ arguments อื่น ๆ แล้วเราก็เข้าถึง req.headers.user
  const user = context.getArgs()[2]?.req.headers?.user;
  log('getCurrentUserByContext', user);

  log(context.getArgs()[2]?.req.headers, 'aaaaaa');

  // 4) ถ้ามีค่าจริง (ไม่เป็น undefined/null) จะทำการแปลงค่าจาก JSON เป็น object
  //    ทั้งนี้เพราะเราอาจส่ง user มาใน Header เป็น JSON string
  //    เช่น "{"id": "1", "name": "Alice"}"
  if (user) {
    return JSON.parse(user);
  }
};

// สร้าง decorator ที่ชื่อว่า CurrentUser โดยใช้ createParamDecorator จาก @nestjs/common เพื่อใช้ในการดึงข้อมูล user ที่ผ่านการ verify จาก Passport มาใช้งาน แล้วเอาไปใช้ใน function ต่างๆ ใน controller ได้
// decorator จะได้ค่าจาก request.user ถ้าเอาไปใช้ใช้จะได้ค่าจาก request.user
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
