# ----------------------------------------------------------------------------------------------------
# Stage 1: Development
# ----------------------------------------------------------------------------------------------------
# เลือก base image จาก Node.js เวอร์ชัน alpine เพื่อให้เป็น image ที่มีขนาดเล็ก
FROM node:alpine As development

# กำหนด working directory (โฟลเดอร์หลักในการทำงานภายใน container)
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และ pnpm-lock.yaml เข้าไปใน image
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./tsconfig.json
COPY nest-cli.json ./nest-cli.json

# ติดตั้ง pnpm ใน container (เนื่องจาก image node:alpine ไม่มี pnpm มาให้)
RUN npm install -g pnpm

# คัดลอกไฟล์ทั้งหมด (โค้ดโปรเจกต์) จากโฮสต์ไปยัง container
COPY apps/payments ./apps/payments
COPY libs ./libs

# ติดตั้ง dependencies ทั้งหมดของโปรเจกต์ตามที่ระบุในไฟล์ pnpm-lock.yaml
RUN pnpm install

# RUN cd apps/payments && pnpm install

# รันคำสั่ง build ของโปรเจกต์ (เช่น ถ้าเราใช้ NestJS หรือ React ก็อาจจะเป็นคำสั่ง build)
RUN pnpm run build payments

# ----------------------------------------------------------------------------------------------------
# Stage 2: Production
# ----------------------------------------------------------------------------------------------------
# เลือก base image จาก Node.js เวอร์ชัน alpine อีกครั้ง เพื่อใช้เป็น production image ที่สะอาด
FROM node:alpine As production

# กำหนดค่า ARG และ ENV เพื่อระบุว่าโปรเจกต์จะรันใน environment แบบ production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# กำหนด working directory
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และ pnpm-lock.yaml เข้าไปใน production image
COPY package.json ./
COPY pnpm-lock.yaml ./

# ติดตั้ง pnpm เช่นเดียวกับ stage development (แต่ไม่จำเป็นต้องติดตั้ง dependencies dev)
RUN npm install -g pnpm

# ติดตั้ง dependencies เฉพาะที่จำเป็นสำหรับ production
RUN pnpm install --prod

# คัดลอกโค้ดที่ build แล้ว (folder dist) จาก stage แรก (development) มาใส่ใน production image
COPY --from=development /usr/src/app/dist ./dist

# กำหนดคำสั่งเริ่มต้น (entrypoint) เมื่อตัว container รันขึ้นมา
# ในตัวอย่างนี้ให้ใช้ node รันไฟล์ main.js ซึ่งเป็นไฟล์หลักของโปรเจกต์
CMD ["node", "dist/apps/payments/main.js"]
