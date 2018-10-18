var express = require("express");
var bodyParser = require("body-parser");
var db = require('./db');
var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



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
  console.log(recipe.title);

  const newRecipe = await db.postRecipe(recipe);
  res.send(await newRecipe);

});

router.put('/:id', async function (req, res){
  //needs to add error checking
  const recipe = await req.body;
  console.log(recipe);
  const newRecipe = await db.replaceRecipe(recipe._id, recipe);
  res.send(newRecipe);
});

router.patch('/:id', async function (req, res){
  //needs to add error checking
  const recipe = req.body;
  const newRecipe = await db.patchRecipe(recipe.id, recipe);
  res.send(newRecipe);
});

router.delete("/:id", async function (req, res) {
  console.log(req.params.id);
  await db.removeRecipe(req.params.id);
  res.status(200).end;
});

app.use('/recipes', router);

module.exports = router;
