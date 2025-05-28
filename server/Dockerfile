FROM node:20-alpine

WORKDIR /app

# Install OpenSSL 1.1
RUN apk add --no-cache openssl

# Add build argument for OPENAI_API_KEY
# ARG OPENAI_API_KEY
# ENV OPENAI_API_KEY=$OPENAI_API_KEY

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma Client
COPY src/prisma ./prisma
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]