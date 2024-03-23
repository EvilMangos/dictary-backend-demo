FROM node:20.0.0

WORKDIR /backend

COPY . .

RUN npm install

CMD npm run build; npm run start:prod

EXPOSE 3000