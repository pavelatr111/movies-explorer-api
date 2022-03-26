const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cookieParser());

app.use(requestLogger);

app.use('/', require('./routes/routesAuth'));
app.use('/users', auth, require('./routes/routesUser'));
app.use('/movies', auth, require('./routes/routesMovie'));

app.use(errorLogger); // подключаем логгер ошибок

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {

});
