const mongoose = require('mongoose')

mongoose.connect(
  'mongodb+srv://Ruslan:Bondik25cur@cluster0-t9zc4.mongodb.net/task-manager?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
)
