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

router.get("/:id", function (req, res) {


});

router.post("/", async function (req, res) {
  const recipe = await req.body;
  console.log(recipe.title);

  const newRecipe = await db.createRecipe(recipe.title, recipe.ingredients, recipe.steps);
  res.send(await newRecipe);

});

router.put("/:id", function (req, res) {


});

router.post("/:id", function (req, res) {

});
router.delete("/:id", function (req, res) {

});

app.use('/recipes', router);

module.exports = router;
