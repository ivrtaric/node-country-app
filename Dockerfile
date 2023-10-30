FROM node:20-alpine

ARG port
ENV PORT $port

WORKDIR /app

COPY package*json ./
RUN npm ci --omit=dev

COPY tsconfig.json .
COPY .env .
COPY ./src ./src

EXPOSE $port

ENTRYPOINT ["npm", "start"]
