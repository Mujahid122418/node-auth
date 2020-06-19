const mongoose = require('mongoose');
const db = 'mongodb+srv://Mujahid:Mujahid_1@cluster0-tbovr.mongodb.net/bootcamp'
 mongoose.connect(db, { 
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true ,
        useFindAndModify:false
      })
    .then(() => console.log('MongoDB connected now...'))
    .catch(err => console.log('connection db err',err));
