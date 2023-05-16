const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "db4free.net",
    user: "omkarmraskar",
    password: "12345678",
    database: "tool__molecule",
  },
  listPerPage: 100,
  SECRET_KEY:
    "4ea5c508a6566e76240543f8feb06fd457777be39549c4016436afda65d2330e",
  serverUrl: "http://localhost:",
  port: 3000,
};
module.exports = config;
