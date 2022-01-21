const expreess = require("express");

const Usuario = require("../models/usuario");
const app = expreess();

//PARA EMcRIPTAR LA CONTRASEÑA
const bcrypt = require("bcrypt");
const _ = require("underscore"); //Nos permite hacer una copia de un objeto filtrando los campos que queremos

app.get("/usuario", (req, res) => {
  let desde = req.query.desde || 0; //query paramets
  desde = Number(desde);

  let limite = req.query.limite || 0; //query paramets
  limite = Number(limite);

  // Usuario.find({})//sin exclusiones
  Usuario.find({estado:true}, "nombre email role estado google img") //con exclusiones
    .skip(desde) //salta los registros que no queremos
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      // Usuario.count({}, (err, conteo) => {
      Usuario.count({estado:true}, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo,
        });
      });
    });
});

app.post("/usuario", (req, res) => {
  const body = req.body;
  //ENCRIPTAR LA CONTRASEÑA
  const hash = bcrypt.hashSync(body.password, 10);

  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: hash,
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    // usuarioDB.password = null;
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put("/usuario/:id", (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]); //aunque enviemo todos los campos, solo nos interesa los que nosotros queremos

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        id,
        usuario: usuarioDB,
      });
    }
  );
});

app.delete("/usuario/:id", (req, res) => {
  // res.json("delete");
  let id = req.params.id;

  let cambiaEstado = {
    estado: false,
  };

  Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true}, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado",
        },
      });
    }

    res.json({
      id,
      usuario: usuarioBorrado,
    });
  });
  //DELETE SIEMPRE
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err,
  //     });
  //   }
  //   if (!usuarioBorrado) {
  //     return res.status(400).json({
  //       ok: false,
  //       err: {
  //         message: "Usuario no encontrado",
  //       },
  //     });
  //   }

  //   res.json({
  //     id,
  //     usuario: usuarioBorrado,
  //   });
  // });
});

module.exports = app;
