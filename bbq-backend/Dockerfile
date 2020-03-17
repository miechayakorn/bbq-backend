FROM node:13.10-alpine

COPY . /app/adonis/

WORKDIR /app/adonis

ADD init.sh /
RUN /init.sh

CMD ["npm", "run", "serve"]

EXPOSE 3333
