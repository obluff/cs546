import json
import requests

with open('pasta.json') as f: recipeData= json.load(f)

print(recipeData)

r = requests.post('http://localhost:3000/recipes', json=recipeData)
print(r.text)

r = requests.get('http://localhost:3000/recipes')
print(r.text)
