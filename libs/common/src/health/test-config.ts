// src/config/app.config.ts
export default () => ({
  // ใส่ config ที่อยากเก็บ
  port: 3000,
  appName: 'My Nest App',
  database: {
    host: 'localhost',
    port: 5432,
  },
});
