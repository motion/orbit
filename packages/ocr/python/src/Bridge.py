import sys
import objc
from Foundation import NSObject
import time
import torch
from constants import model_path, letters, ocr_path
from torch.autograd import Variable
import csv

print("hi mom")

# Load the protocol from Objective-C
BridgeInterface = objc.protocolNamed("aperture.OCRInterface")

print("BridgeInterface", BridgeInterface)


class Bridge(NSObject, protocols=[BridgeInterface]):
    @classmethod
    def createInstance(self):
        return Bridge.alloc().init()

    def ocrCharacters(self):
        file = open('/tmp/characters.txt', 'r')
        print("got file")
        tensors = []

        for line in file:
            vals = [float(x) for x in line.split(' ')[:-1]]
            # print('read', len(vals))
            if len(vals) == 0:
                continue
            tensor = torch.Tensor(28, 28)
            for row in range(28):
                for col in range(28):
                    tensor[row, col] = vals[col * 28 + row]

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

        print('predicted', predicted)
        return predicted
