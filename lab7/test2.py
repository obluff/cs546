import json
import requests

with open('gang.json') as f: recipeData= json.load(f)
print(recipeData)
r = requests.put('http://localhost:3000/recipes/'+recipeData['_id'], data=(recipeData))
print(r.text)

