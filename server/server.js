require("./config/config");
const expreess = require("express");
const app = expreess();

//for parsing json
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/task", (req, res) => {
  res.json("get");
});
app.post("/task", (req, res) => {
  const body = req.body;

  if (body.title === undefined) {
    res.status(400).json({
      error: "Title is required",
    });
  } else {
    res.json({
      task: body,
    });
  }
});
app.put("/task/:id", (req, res) => {
  const id = req.params.id;
  res.json({
    id,
  });
});

app.delete("/task", (req, res) => {
  res.json("delete");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
