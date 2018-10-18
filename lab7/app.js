const express = require('express')
const app = express()
const router = express.Router()
const db = require('./db')
var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});


// gets recipes
router.get("/", async function (req, res) {
    body = await db.getAllRecipes();
    res.send(body);
  });

router.get("/:id", async function (req, res) {
    const recipe = await db.getRecipe(req.params.id);
    res.json(recipe);
});

router.post("/", async function (req, res) {
  const recipe = await req.body;
  console.log(recipe);
  const newRecipe = await db.postRecipe(recipe);
  res.send(await newRecipe);

});

router.put('/:id', async function (req, res){
  //needs to add error checking
  const recipe = await req.body;
  console.log(recipe);
  const newRecipe = await db.replaceRecipe(await req.params.id, recipe);
  res.send(newRecipe);
});

router.patch('/:id', async function (req, res){
  //needs to add error checking
  const recipe = await req.body;
  const id = await req.params.id;
  const newRecipe = await db.patchRecipe(id, recipe);
  res.send(newRecipe);
});

router.delete("/:id", async function (req, res) {
  console.log(req.params.id);
  await db.removeRecipe(req.params.id);
  res.status(200).end;
});

app.use('/recipes', router);

module.exports = router;
