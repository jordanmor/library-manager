const express = require('express');
const path = require('path');

const routes = require('./routes/index');
const books = require('./routes/books');
const patrons = require('./routes/patrons');
const loans = require('./routes/loans');

const app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');

app.use('/', routes);
app.use('/books', books);
// app.use('/patrons', patrons);
// app.use('/loans', loans);

app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use( (err, req, res, next) => {
  res.locals.error = err;
  console.log(`The following error has occurred: ${err.message} ${err.status}`);
  res.status(err.status).render('error');
});

app.listen(3000, () => console.log('The application is running on localhost:3000!'));