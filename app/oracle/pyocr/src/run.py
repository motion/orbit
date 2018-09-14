import sys
import net
import torch
from torch.autograd import Variable
import json
import os
from constants import model_path, letters, ocr_path
import fileinput

print("starting python ocr")
model = torch.load(model_path)


# def eprint(*args, **kwargs):
#     print(*args, file=sys.stderr, **kwargs)


for line in fileinput.input():
    file = open('/tmp/characters.txt', 'r')
    tensors = []

    for line in file:
        vals = [float(x) for x in line.split(' ')[:-1]]
        if len(vals) == 0:
            continue
        tensor = torch.Tensor(28, 28)
        for row in range(28):
            for col in range(28):
                tensor[row, col] = vals[col * 28 + row]
        tensors.append(tensor)

    x = torch.zeros(len(tensors), 1, 28, 28)
    for index, tensor in enumerate(tensors):
        x[index, 0, :] = tensor

    data = Variable(x, volatile=True)
    output = model(data)
    # get the index of the max log-probability
    pred = output.data.max(1, keepdim=True)[1]
    predicted = [letters[letter[0]] for letter in pred.numpy()]

    # sys.stdout = sys.__stdout__
    # eprint(json.dumps(predicted))
    print(json.dumps(predicted))

    if os.environ['OUTFILE']:
        with open(os.environ['OUTFILE'], 'w') as outfile:
            json.dump(predicted, outfile)
