# Use the official Node.js image
FROM node:alpine 

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the dependencies file to the working directory
COPY . .

# Install pnpm (faster than npm)
RUN npm install -g pnpm

# Install all dependencies with --force
# pnpm i --force คือ การลบ node_modules ที่มีอยู่แล้ว แล้วทำการ install ใหม่
RUN pnpm install --force

# Run the tests
CMD ["pnpm", "test"]