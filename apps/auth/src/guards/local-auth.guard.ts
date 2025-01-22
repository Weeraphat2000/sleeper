import { AuthGuard } from '@nestjs/passport';

// สร้าง LocalAuthGuard โดยใช้ AuthGuard และกำหนด strategy เป็น 'localna' ให้เหมือนกับ LocalStrategy
export class LocalAuthGuard extends AuthGuard('localna') {}
