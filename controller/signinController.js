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

  app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    db.select("*")
      .from("login")
      .where("email", "=", email)
      .then((data) => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          db.select("*")
            .from("users")
            .where("email", "=", email)
            .then((user) => {
              db.select("*")
                .from("todo_table")
                .where("user_id", "=", user[0].user_id)
                .then((resp) => res.json(resp))
                .catch((err) => console.log("wrong email or password"));
            });
        } else {
          res.status(400).json("wrong password");
        }
      })
      .catch((err) => res.status(400).json("wrong credentials"));
  });
};
