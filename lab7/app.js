const express = require('express')
const app = express()
const router = express.Router()
const db = require('./db')
var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function isObj(item){
  return typeof(item) === 'object';
}
function isStr(item){
  return typeof(item) === 'string';
}

function checkRecipe(recipe, full){
    var length = Object.keys(recipe).length;
    if(length > 3) return false;

    if(full == true) length = 3;

    if(recipe.hasOwnProperty('title')){
      if(!isStr(recipe.title)) return false;
      length += -1
    }
    if(recipe.hasOwnProperty('ingredients')){
      if(!Array.isArray(recipe.ingredients)) return false;
      if(!recipe.ingredients.every(isObj)) return false;
      length += -1
    }
    if(recipe.hasOwnProperty('steps')){
      if(!Array.isArray(recipe.steps)) return false;
      if(!recipe.steps.every(isStr)) return false;
      length += -1
    }

    if(length != 0) return false;
    return true;
}

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});


// gets recipes
router.get("/", async function (req, res) {
  try{
    body = await db.getAllRecipes();
    res.send(body);
  } catch(e) {
    res.status(404).json(e)
   }
  });

router.get("/:id", async function (req, res) {
  try{
    const recipe = await db.getRecipe(req.params.id);
    res.json(recipe);
  } catch(e) {
    res.status(404).json(e)
}
});

router.post("/", async function (req, res) {
  try{
  const recipe = await req.body;
  console.log(recipe);
  if(!checkRecipe(recipe, true)) throw 'provided incorrect object';
  const newRecipe = await db.postRecipe(recipe);
  res.send(await newRecipe);
} catch(e) {
  res.status(404).json(e)
}

});

router.put('/:id', async function (req, res){
  //needs to add error checking
  try{
  const recipe = await req.body;
  console.log(recipe);
  if(!checkRecipe(recipe, true)) throw 'provided incorrect object';

  const newRecipe = await db.replaceRecipe(await req.params.id, recipe);
  res.send(newRecipe);
} catch(e) {
  res.status(404).json(e)
}
});

router.patch('/:id', async function (req, res){
  try{
  //needs to add error checking
  const recipe = await req.body;
  const id = await req.params.id;
  if(!checkRecipe(recipe, false)) throw 'provided incorrect object';

  const newRecipe = await db.patchRecipe(id, recipe);
  res.send(newRecipe);
} catch(e) {
  res.status(404).json(e)
}
});

router.delete("/:id", async function (req, res) {
  try{

  await db.removeRecipe(req.params.id);
  res.status(200).end()
} catch(e) {
  res.status(404).json(e);
}
});

app.use('/recipes', router);

module.exports = router;
