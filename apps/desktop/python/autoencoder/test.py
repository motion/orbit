import os

import torch
import torchvision
from torch import nn
from torch.autograd import Variable
from torch.utils.data import DataLoader
from torchvision import transforms
from torchvision.utils import save_image
from torch.utils.data import TensorDataset
import numpy as np
from model import autoencoder
from pprint import pprint
from helpers import load, neighbors

(words, vectors) = load()

model = autoencoder()
model.load_state_dict(torch.load('./model.pth'))
compressed = []
for vec in vectors:
    X = Variable(vec)
    output = model.encoder(X)
    compressed.append(output.data.numpy())

neighbors(words, compressed)