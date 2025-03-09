import { INestApplication } from '@nestjs/common';

let app: INestApplication;

const setApp = (_app: INestApplication) => {
  app = _app; // ใช้เพื่อให้สามารถเรียกใช้ app จากที่อื่นได้
};

export { app, setApp };
