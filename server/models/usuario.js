
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message:'{VALUE} no es un rol valido'
};


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El email es necesario"],
    },
    password: {
        type: String,
        required: [true, "La contraseña es necesaria"],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum:rolesValidos
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

//para nunca enviar la contraseña en el json
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();//convierte el objeto a un objeto de javascript
    delete userObject.password;
    return userObject;
};


//para que no se repita el email
usuarioSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser único" });

module.exports = mongoose.model("Usuario", usuarioSchema);