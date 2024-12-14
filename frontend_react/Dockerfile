FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

ENV PATH /app/node_modules/.bin:$PATH

ENV PORT=4200

EXPOSE 4200

CMD ["npm", "start"]
