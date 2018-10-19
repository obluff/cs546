import json
import requests
#not that exhaustive but just used it to test functionality easier


with open('eggs.json') as f: recipeData= json.load(f)

print('\n\n' + 'adding to the database')
r = requests.post('http://localhost:3000/recipes', json=recipeData)
print(r.text)
results = json.loads(r.text)
print('\n\n' + 'looking at all recipes')

r = requests.get('http://localhost:3000/recipes')
print(r.text)


print('\n\n' + 'replacing fried eggs with unfried eggs')
with open('replacementEggs.json') as f: recipeData= json.load(f)
r = requests.put('http://localhost:3000/recipes/' + results['_id'], json = recipeData)
print(r.text)

results = json.loads(r.text)

print('\n\n' + 'changing unfried eggs to mustard eggs')
with open('mustardEggs.json') as f: recipeData= json.load(f)
r = requests.patch('http://localhost:3000/recipes/' + results['_id'], json = recipeData)
print(r.text)

print('\n\n' + 'deleting fried eggs then looking at all recipes')
r = requests.delete('http://localhost:3000/recipes/' + results['_id'])
print('deleted')

r = requests.get('http://localhost:3000/recipes')
print(r.text)
