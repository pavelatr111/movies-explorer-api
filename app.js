require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./errors/not-found-error');
const middlewareErorr = require('./middleware/error');

const { DATABASE_URL, NODE_ENV } = process.env;

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: ['http://localhost:3001', 'https://pavelpavlov.nomoredomains.xyz'],
  credentials: true,
}));

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cookieParser());

app.use(requestLogger);

app.use(require('./routes/routesAuth'));

app.use(auth, require('./routes/routesUser'));
app.use(auth, require('./routes/routesMovie'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница по указоному адресу не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(middlewareErorr);

app.use(errors({ message: 'error validation' }));

app.listen(PORT, () => {

});
