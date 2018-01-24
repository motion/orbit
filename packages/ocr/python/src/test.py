import time
import torch
# from get_letter import get_letter
from constants import model_path, letters, ocr_path
from torch.autograd import Variable
import csv

file = open(ocr_path, 'r')
tensors = []

for line in file:
    vals = [float(x) for x in line.split(' ')[:-1]]
    # print('read', len(vals))
    if len(vals) == 0:
        continue
    tensor = torch.Tensor(28, 28)
    for row in range(28):
        for col in range(28):
            tensor[row, col] = vals[row * 28 + col]

    tensors.append(tensor)

model = torch.load(model_path)

x = torch.zeros(len(tensors), 1, 28, 28)
for index, tensor in enumerate(tensors):
    x[index, 0, :] = tensor

data = Variable(x, volatile=True)
output = model(data)
# get the index of the max log-probability
pred = output.data.max(1, keepdim=True)[1]
predicted = [letters[letter[0]] for letter in pred.numpy()]

file = open('./data/prediction.txt', "w")
file.write(''.join(predicted))
file.close()

print('predicted', predicted)
