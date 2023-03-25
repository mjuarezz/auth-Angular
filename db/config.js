const mongoose = require("mongoose");


const dbConection = async() => {
  try {

    await mongoose.connect( process.env.BD_CNN, {
        useNewUrlParser: true,
        useUnifiedTopology: true        
    });

    console.log('BD connected');

  } catch (error) {
    console.log(error);
    throw new Error('Error al inicializar la BD')
  }

  
}

module.exports = {
    dbConection
}