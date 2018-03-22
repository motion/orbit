from allennlp.commands.elmo import ElmoEmbedder
from sklearn.neighbors import NearestNeighbors
import nltk
import json
import re
from nltk.corpus import stopwords
import numpy as np
from nltk.corpus import semcor
from flask import Flask, json, request
import os

import torch
from torch.autograd import Variable
from autoencoder.helpers import load, neighbors
from autoencoder.model import autoencoder

app = Flask(__name__)

ee = ElmoEmbedder()

def get_embedding(words):
  sentence = []

  for i, word in enumerate(words):
    sentence.append(word)

  embedding = ee.embed_sentence(sentence)
  vecs = list(range(len(sentence)))
  for index, word in enumerate(sentence):
    vecs[index] = (embedding[0][index] + embedding[1][index] + embedding[2][index]) / 3

  return vecs

model = autoencoder()
model.load_state_dict(torch.load('./autoencoder/model.pth'))

@app.route('/get_sentence')
def get_sentence():
    words = json.loads(request.args.get('words'), strict=False)
    vectors = []
    for word in get_embedding(words):
      x = Variable(torch.Tensor(word.tolist()))
      vectors.append(model.encoder(x).data.numpy().tolist())
    
    response = app.response_class(
        response=json.dumps(vectors),
        status=200,
        mimetype='application/json'
    )

    return response

app.run()