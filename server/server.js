require("./config/config");
const expreess = require("express");
const app = expreess();

const mongoose = require("mongoose");

//for parsing json
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



app.use(require("./routes/usuario"));



mongoose.connect("mongodb://localhost:27017/task",{useNewUrlParser: true,useUnifiedTopology: true 
} ,(err) => {
  if (err) throw err;

  console.log("conectado a mongo");
});





app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
