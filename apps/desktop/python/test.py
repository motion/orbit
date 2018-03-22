import json

with open('./test.txt', 'r') as f:
  text = f.read()
  print('json is', json.loads(text, strict=False))
  
