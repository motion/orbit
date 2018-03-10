from allennlp.commands.elmo import ElmoEmbedder
from sklearn.neighbors import NearestNeighbors
import nltk
import re
from nltk.corpus import stopwords
import numpy as np
from nltk.corpus import semcor
from flask import Flask, json, request

app = Flask(__name__)

ee = ElmoEmbedder()

def get_embedding(s):
  words = s.split()
  sentence = []

  for i, word in enumerate(words):
    sentence.append(word)

  embedding = ee.embed_sentence(sentence)
  vecs = list(range(len(sentence)))
  for index, word in enumerate(sentence):
    vecs[index] = (embedding[0][index] + embedding[1][index] + embedding[2][index]) / 3

  return vecs

@app.route('/get_sentence')
def get_sentence():
    sentence = request.args.get('sentence')
    print('sentence is', sentence, 'split is', sentence.split())
    data = [x.tolist() for x in get_embedding(sentence)]
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response

app.run()