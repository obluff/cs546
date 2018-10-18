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
expt.postRecipe = async function(obj){
  if(!obj) throw "no object provided";
  const cookbook = await recipes();
  const recipeId = uuidv1();
  obj._id = recipeId;
  const insertInfo = await cookbook.insertOne(obj);
  if(insertInfo.insertedCount === 0) throw "could not add recipe";
  return await expt.getRecipe(recipeId);
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
expt.replaceRecipe = async function(recipeId, obj){
  await expt.removeRecipe(recipeId);
  return await expt.postRecipe(obj);
}

expt.patchRecipe = async function(recipeId, obj){
  const cookbook = await recipes();
  const res = await cookbook.updateOne({_id: recipeId}, { $set: obj });
  if(res.error) throw res.error;
  if (res.matchedCount === 0) throw 'no recipe matched';
  return expt.getRecipe(recipeId);
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
