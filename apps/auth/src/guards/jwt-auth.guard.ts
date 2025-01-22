import { AuthGuard } from '@nestjs/passport';

// สร้าง JwtAuthGuard โดยใช้ AuthGuard และกำหนด strategy เป็น 'jwtnaa' ให้เหมือนกับ JwtStrategy
export class JwtAuthGuard extends AuthGuard('jwtnaa') {}
