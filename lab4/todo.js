const mongoCollections = require("./mongoCollections");
const tasks = mongoCollections.tasks;
const uuidv1 = require('uuid/v1');

var expt = module.exports;

expt.getTask = async function(id){
  if (!id) throw "you need to provide an id";
  const todolist = await tasks();
  const task = await todolist.findOne({ _id: id});
  if(task === null) throw "no task with that id";

  return task;
}

expt.createTask = async function(title, description){
  if(!title) throw "provide a title";
  if(!description) throw "provide a description";
  const taskId = uuidv1();
  const todolist = await tasks();

  const newTask = {
    "_id": taskId,
    "title": title,
    "description": description,
    "completed": false,
    "completedAt": null
  };

expt.getAllTasks = async function(){
  const todolist = await tasks();
  return await todolist.find({}).toArray();
}

  const insertInfo = await todolist.insertOne(newTask);
  if (insertInfo.insertedCount === 0) throw "Could not add post";

  return await expt.getTask(taskId);
}

expt.completeTask = async function(taskId){
  const completionTime= uuidv1();

  if(!taskId) throw "provide a taskid";
  const todolist = await tasks();
  const task = await expt.getTask(taskId);
  if(task.completed != false){
    console.log('task is already completed');
  }
  else{
  let updatedTask = task;
  updatedTask['completed'] = true;
  updatedTask['completedAt'] = completionTime;
  const completedTask = await todolist.replaceOne({_id: taskId}, updatedTask);
  if(completedTask.modifiedCount === 0) throw "could not update task";
  }
  return await expt.getTask(taskId);
}

expt.removeTask = async function(taskId){
  const todolist = await tasks();
  const deleted = await todolist.removeOne({ _id: taskId });

  if(deleted.deletedCount == 0){
    throw 'couldnt delete';
  }
  0;

}
