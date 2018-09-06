const express = require('express');
const router = express.Router();
const { Books, Patrons, Loans } = require('../models');
const { paginate, setOffset } = require('../utilities/paginate');
const { Op } = require('sequelize');
const pageLimit = 5;


/*=============-=============-=============-=============
        GET searched for books / GET all books
===============-=============-=============-===========*/

router.get('/', (req, res) => {
  const { keyword, input, page: currentPage } = req.query;
  const searchWasPerformed = keyword && input;
  const offset = setOffset(currentPage, pageLimit);
  
  if (searchWasPerformed) {

    Books.findAndCountAll({
      // Query filtered with search keyword and input
      where: {
        [keyword]: {
          [Op.like]: `%${input}%`
        }
      },
      limit: pageLimit,
      offset: offset
    })
    .then(result => {
      const templateData = {
        books: result.rows,
        pageUrl: '/books',
        search: {
          searchResult: true, // hide search div + render "Return to Full List" button
          list: 'books'
        },
        pagination: {
          pages: paginate(result.count, pageLimit, currentPage),
          query: `keyword=${keyword}&input=${input}&` 
        }
      }
      res.render('books/index', { templateData })
    })
    .catch(err => res.sendStatus(500));

  } else {
    // When no search is performed, all books listed
    Books.findAndCountAll({
      limit: pageLimit,
      offset: offset
    })
    .then(result => {
      const templateData = {
        books: result.rows,
        pageUrl: '/books',
        search: {
          list: 'books'
        },
        pagination: {
          pages: paginate(result.count, pageLimit, currentPage)
        }
      }
      res.render('books/index', { templateData })
    })
    .catch(err => res.sendStatus(500));  
  }
});

/*=============-=============-=============-=============
 GET searched for overdue books / GET all overdue books
===============-=============-=============-===========*/

router.get('/overdue', (req, res) => {
  const { keyword, input, page: currentPage } = req.query;
  const searchWasPerformed = keyword && input;
  const offset = setOffset(currentPage, pageLimit);
  
  if (searchWasPerformed) {

    Books.findAndCountAll({
      // Query filtered with search keyword and input
      where: {
        [keyword]: {
          [Op.like]: `%${input}%`
        }
      },
      // Finds overdue books using eager loading
      include: [{
        model: Loans,
        // Query filters: 
        // book has a loaned_on date / return_by date is before today's date / no returned_on date
        where: {
          loaned_on: {
            [Op.ne]: null
          },
          return_by: {
            [Op.lt]: new Date()
          },
          returned_on: null
        }
      }],
      limit: pageLimit,
      offset: offset
    })
    .then(result => {
      const templateData = {
        books: result.rows,
        pageUrl: '/books/overdue',
        search: {
          searchResult: true, // hide search div + render "Return to Full List" button
          list: 'books'
        },
        pagination: {
          pages: paginate(result.count, pageLimit, currentPage),
          query: `keyword=${keyword}&input=${input}&` 
        }
      }
      res.render('books/index', { templateData })
    })
    .catch(err => res.sendStatus(500));

  } else {
    // When no search is performed, all overdue books listed
    Books.findAndCountAll({
      // Finds overdue books using eager loading
      include: [{
        model: Loans,
        // Query filters: 
        // book has a loaned_on date / return_by date is before today's date / no returned_on date
        where: {
          loaned_on: {
            [Op.ne]: null
          },
          return_by: {
            [Op.lt]: new Date()
          },
          returned_on: null
        }
      }],
      limit: pageLimit,
      offset: offset
    })
    .then(result => {
      const templateData = {
        books: result.rows,
        pageUrl: '/books/overdue',
        search: {
          list: 'books'
        },
        pagination: {
          pages: paginate(result.count, pageLimit, currentPage)
        }
      }
      res.render('books/index', { templateData })
    })
    .catch(err => res.sendStatus(500));
  }
});

/*=============-=============-=============-=============-=============
    GET searched for checked out books / GET all checked out books
===============-=============-=============-===========-=============*/

router.get('/checked_out', (req, res) => {
  const { keyword, input, page: currentPage } = req.query;
  const searchWasPerformed = keyword && input;
  const offset = setOffset(currentPage, pageLimit);

  if (searchWasPerformed) {

    Books.findAndCountAll({
      // Query filtered with search keyword and input
      where: {
        [keyword]: {
          [Op.like]: `%${input}%`
        }
      },
      // Finds checked out books using eager loading
      include: [{
        // Query filters: book has a loaned_on date / no returned_on date
        model: Loans,
        where: {
          loaned_on: {
            [Op.ne]: null
          },
          returned_on: null
        }
      }],
      limit: pageLimit,
      offset: offset
    })
    .then(result => {
      const templateData = {
        books: result.rows,
        pageUrl: '/books/checked_out',
        search: {
          searchResult: true, // hide search div + render "Return to Full List" button
          list: 'books'
        },
        pagination: {
          pages: paginate(result.count, pageLimit, currentPage),
          query: `keyword=${keyword}&input=${input}&` 
        }
      }
      res.render('books/index', { templateData })
    })
    .catch(err => res.sendStatus(500));

  } else {
    // When no search is performed, all checked out books listed
    Books.findAndCountAll({
      // Finds checked out books using eager loading
      include: [{
        model: Loans,
        // Query filters: book has a loaned_on date / no returned_on date
        where: {
          loaned_on: {
            [Op.ne]: null
          },
          returned_on: null
        }
      }],
      limit: pageLimit,
      offset: offset
    })
    .then(result => {
      const templateData = {
        books: result.rows,
        pageUrl: '/books/checked_out',
        search: {
          list: 'books'
        },
        pagination: {
          pages: paginate(result.count, pageLimit, currentPage)
        }
      }
      res.render('books/index', { templateData })
    })
    .catch(err => res.sendStatus(500));
  }
});

/*=============-=============-=============-=============
                Create a new book form
===============-=============-=============-===========*/

router.get('/new', (req, res) => {
  res.render('books/new', { book: Books.build() });
});

/*=============-=============-=============-=============
                    POST create book
===============-=============-=============-===========*/

router.post('/new', (req, res) => {
  Books.create(req.body)
    .then( book => res.redirect('/books'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render("books/new", {
          book: Books.build(req.body), 
          errors: err.errors
        });
      } else {throw err;}
    })
    .catch(err => res.sendStatus(500));
});

/*=============-=============-=============-=============
                    GET individual book
===============-=============-=============-===========*/

router.get("/:id", (req, res) => {
  // Use nested eager loading to load all related models of the book model
  Books.findById(req.params.id, {
    include: [{
      model: Loans, 
        include: [{
          model: Patrons
        }]
      }]
    })
    .then( book => {
      if (book) {
        res.render('books/detail', { 
          form: book, 
          book: book, 
          loans: book.Loans 
        })
      } else {
        res.sendStatus(404)
      }
    })
    .catch(err => res.sendStatus(500));
});

/*=============-=============-=============-=============
                      PUT update book
===============-=============-=============-===========*/

router.put("/:id", (req, res) => {
  Books.findById(req.params.id)
    .then(book => book.update(req.body))
    .then(book => res.redirect('/books'))
    .catch(err => {

      if (err.name === 'SequelizeValidationError') {
        const updatedBook = Books.build(req.body);
        updatedBook.id = req.params.id;

        Books.findById(req.params.id, {
          // Use nested eager loading to load all related models of the book model
          include: [{
            model: Loans, 
              include: [{
                model: Patrons
              }]
            }]
          })
          .then( book => {
            if (book) {
              res.render('books/detail', { 
                form: updatedBook, 
                book: book, 
                loans: book.Loans, 
                errors: err.errors 
              })
            } else {
              res.sendStatus(404)
            }
          })
          .catch(err => res.sendStatus(500));

      } else {throw err;}
    })
    .catch(err => res.sendStatus(500));
});

module.exports = router;