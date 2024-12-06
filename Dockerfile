FROM node:lts as build

WORKDIR /app

COPY . .

RUN npm install

RUN test -f .env || cp .env.example .env

EXPOSE 3333

# CMD ["npm", "run", "dev"]

CMD ["sh", "-c", "npm run pg:ref && npm test"]
