const mongoCollections = require("./mongoCollections");
const recipes = mongoCollections.recipes;
const uuidv1 = require('uuid/v1');

var expt = module.exports;


expt.getRecipe = async function(id){
  if (!id) throw "you need to provide an id";
  const cookbook = await recipes();
  const recipe = await cookbook.findOne({ _id: id});
  if(recipe === null) throw "no recipe with that id";

  return recipe;
}

expt.createRecipe = async function(title, ingredients, steps){
  if(!title) throw "provide a title";
  if(!ingredients) throw "you need ingredients for your recipe";
  if(!steps) throw "you didn't provide steps for your recipe";
  const recipeId = uuidv1();
  const cookbook = await recipes();

  const newRecipe = {
    "_id": recipeId,
    "title": title,
    "ingredients": ingredients,
    "steps": steps
  };
  const insertInfo = await cookbook.insertOne(newRecipe);
  if (insertInfo.insertedCount === 0) throw "Could not add post";

  return await expt.getRecipe(recipeId);
}

expt.removeRecipe = async function(recipeId){
  const cookbook = await recipes();
  const deleted = await cookbook.removeOne({ _id: recipeId });
  if(deleted.deletedCount == 0){
    throw 'couldnt delete';
  }
  0;
}


expt.getAllRecipes = async function(){
  const cookbook = await recipes();
  return await cookbook.find({}).toArray();
}
