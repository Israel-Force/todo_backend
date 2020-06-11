module.exports = function (app) {
  const bodyParser = require("body-parser");
  const knex = require("knex");
  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  // init knex
  const db = knex({
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      password: "3279",
      database: "Todo_app",
    },
  });

  //confg bodyParser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/register", (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction((trx) => {
      db.insert({
        first_name: first_name,
        last_name: last_name,
        email: email,
        joined: new Date(),
      })
        .into("users")
        .returning("*")
        .then((data) => {
          return trx("login")
            .returning("*")
            .insert({
              user_id: data[0].user_id,
              email: data[0].email,
              hash,
            })
            .then((user) => {
              return trx("todo_table")
                .returning("*")
                .insert({
                  user_id: user[0].user_id,
                })
                .then((item) => {
                  res.json(item);
                });
            });
        })
        .catch((err) => {
          res.status(400).json("email already exist");
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  });
};
