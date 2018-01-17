import time
from torch import zeros, load, Tensor
# from get_letter import get_letter
from constants import model_path, letters, ocr_path
from torch.autograd import Variable
import csv

file = open(ocr_path, 'r') 
lines = []
for line in file: 
  lines.append([float(x) for x in line.split(' ')[:-1]])

model = load(model_path)

x = zeros(1, 1, 28, 28)
x[0, 0, :] = Tensor(lines)

data = Variable(x, volatile=True)
output = model(data)
pred = output.data.max(1, keepdim=True)[1] # get the index of the max log-probability
predicted = [letters[letter[0]] for letter in pred.numpy()]
print('predicted', predicted)