FROM daocloud.io/node
COPY . /app

WORKDIR /app
RUN npm install

EXPOSE 7000

CMD node main.js