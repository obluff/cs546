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


expt.replaceRecipe = async function(recipeId, obj){
  if(!recipeId) throw 'please provide recipeId';
  if(!obj) throw 'need to provide an object';

  await expt.removeRecipe(recipeId);
  return await expt.postRecipe(obj);
}

expt.patchRecipe = async function(recipeId, obj){
  if(!recipeId) throw 'please provide recipeId';
  if(!obj) throw 'need to provide an object';


  const cookbook = await recipes();
  const res = await cookbook.updateOne({_id: recipeId}, { $set: obj });
  if(res.error) throw res.error;
  if (res.matchedCount === 0) throw 'no recipe matched';
  return expt.getRecipe(recipeId);
}

expt.removeRecipe = async function(recipeId){
  if(!recipeId) throw 'please provide recipeId';


  const cookbook = await recipes();
  const deleted = await cookbook.removeOne({ _id: recipeId });
  if(deleted.error) throw 'error deleting'
  if(deleted.deletedCount == 0) throw 'couldnt delete';
  return true;
}


expt.getAllRecipes = async function(){
  const cookbook = await recipes();
  return await cookbook.find({}).toArray();
}
