import json
from sklearn.neighbors import NearestNeighbors
import numpy as np
import torch

def load():
  data = json.load(open('../../data/vectors.json'))
  vectors = []
  words = []

  for key in data.keys():
    words.append(key)
    vectors.append(data[key])

  return (words, torch.Tensor(vectors))

def neighbor(neighbors, index, words):
  nn_words = [words[word_index] for word_index in neighbors[index]]
  return nn_words

def neighbors(words, vectors):
  X = np.array(vectors)
  nbrs = NearestNeighbors(n_neighbors=4, algorithm='ball_tree').fit(X)
  distances, indices = nbrs.kneighbors(X)
  show_words = ['fire', 'basketball', 'love', 'trust']
  for word in show_words:
    index = words.index(word)
    print('word', word, 'nearest', neighbor(indices, index, words))