module.exports = function (app) {
  const bodyParser = require("body-parser");
  const knex = require("knex");

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

  app.get("/todo/:user_id", (req, res) => {
    const { user_id } = req.params;
    db.select("*")
      .from("todo_table")
      .where("user_id", "=", user_id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log("unable to get"));
  });

  app.post("/todo/:user_id", (req, res) => {
    const { user_id } = req.params;
    const { item } = req.body;
    db("todo_table")
      .returning("*")
      .insert({
        user_id: user_id,
        item,
      })
      .then((response) => {
        db.select("*")
          .from("todo_table")
          .where("user_id", "=", user_id)
          .then((data) => {
            res.json(data);
          });
      })
      .catch((err) => console.log(err));
  });

  app.delete("/todo/:item/:user", (req, res) => {
    const { user, item } = req.params;
    db("todo_table")
      .where("todo_id", item)
      .del()
      .then((resp) => {
        db.select("*")
          .from("todo_table")
          .where("user_id", "=", user)
          .then((data) => {
            res.json(data);
          });
      })
      .catch((err) => console.log(err));
  });

  app.post("/todo/:user_id/:search", (req, res) => {
    const { user_id } = req.params;
    const { search } = req.params;
    db("todo_table")
      .where({
        user_id,
      })
      .andWhere("item", "like", `${search}%`)
      .then((data) => {
        res.json(data);
      });
  });
};
