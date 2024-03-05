require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5500;
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser')

// set the view engine to ejs
let path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectBookData() {
  try {
    await client.connect();
    const result = await client.db("jacobs-quebec").collection("quebec-books").find().toArray();
    console.log("mongo call await inside f/n:", result);

    

    return result;
  } 
  catch(err) {
    console.log("getBookData() error: ", err);
  } 
  finally {

  }
}
// run().catch(console.dir);


//Info from Database
app.get('/', async (req,res) => {

  let result = await getBookData();

  console.log("myResults: ", result);

  res.render('index', {
    pageTitle: "Jacob's Book Database",
    bookData: result

  });

});


app.post('/addBookSuggestion', async (req, res) => {

  try {
    client.connect;
    const collection = client.db("jacobs-quebec").collection("quebec-books");

    console.log(req.body);

    await collection.insertOne(req.body);
    res.redirect('/');
  }
  catch(err) {
    console.log(err);
  }
  finally {

  }

  }
  
});

//Update Book Suggestion
app.post('/updateBookSuggestion', async (req, res) => {
  try {
    console.log("Book Title: ", req.body);

    client.connect;
    const collection = client.db("jacobs-quebec").collection("quebec-books");
    let result = await collection.findOneAndUpdate(
      {_id: new ObjectId(req.body.id)},
      {$set: {name: req.body.name, bookTitle: req.body.bookTitle}}
    )

    .then(result => {
      console.log(result);
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally {

  }
});


//Delete Book Suggestion
app.post('/deleteBookSuggestion', async (req, res) => {
  try {
    console.log("body: ", req.body);

    client.connect;
    const collection = client.db('jacobs-quebec').collection('quebec-books');
    let result = await collection.findOneAndDelete(
      {
        "_id": new ObjectId(req.body.id)
      }
    )
    .then(result => {
      console.log(result);
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally {

  }
});


app.listen(port, () => {
  console.log(`quebec app listening on port ${port}`)
})