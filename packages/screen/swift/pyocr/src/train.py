from __future__ import print_function
from constants import font_path, letters, model_path
from net import Net
from get_args import args
from fonts import fonts, test_fonts, train_fonts
from create_dataset import CreateDataset

import random
import math
import numpy as np
import time

import torch
import torch.optim as optim
import torch.utils.data
import torch.nn.functional as F

from torch.autograd import Variable
from PIL import Image
from get_letter import get_letter


def letter_index(letter):
    return list(letters).index(letter)


train_len = len(letters) * len(train_fonts)
test_len = len(letters) * len(test_fonts)
train_x = torch.Tensor(train_len, 1, 28, 28)
train_y = torch.LongTensor(train_len)
test_x = torch.Tensor(test_len, 1, 28, 28)
test_y = torch.LongTensor(test_len)

print('loading letters...')

for font_index, font in enumerate(train_fonts):
    for index, letter in enumerate(letters):
        _index = font_index * len(letters) + index
        train_x[_index, :] = get_letter(font, letter)
        train_y[_index] = index

for font_index, font in enumerate(test_fonts):
    for index, letter in enumerate(letters):
        _index = font_index * len(letters) + index
        test_x[_index, :] = get_letter(font, letter)
        test_y[_index] = index

train_set = torch.utils.data.TensorDataset(train_x, train_y)
test_set = torch.utils.data.TensorDataset(test_x, test_y)
train_loader = torch.utils.data.DataLoader(
    train_set, batch_size=4, shuffle=True, num_workers=2)
test_loader = torch.utils.data.DataLoader(
    test_set, batch_size=4, shuffle=True, num_workers=2)

model = Net()

optimizer = optim.SGD(model.parameters(), lr=args.lr, momentum=args.momentum)


def run_words(s):
    print('predicting', s)
    x = torch.Tensor(len(s), 1, 28, 28)
    for index, c in enumerate(list(s)):
        choice = random.choice(test_fonts)
        x[index, :] = get_letter('helvetica.ttf', c, True)

    model.eval()
    correct = 0
    start = time.time()
    data = Variable(x)
    output = model(data)
    # get the index of the max log-probability
    pred = output.data.max(1, keepdim=True)[1]
    out_str = [letters[letter[0]] for letter in pred.numpy()]
    print('predicted', ''.join(out_str))

    correct = 0
    for i in range(len(s)):
        if s[i] == out_str[i]:
            correct += 1

    print('correct', correct / len(s) * 100, '%', 'took', time.time() - start)


def train(epoch):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        # data, target = data.cuda(async=True), target.cuda(async=True) # On GPU
        data = Variable(data)
        target = Variable(target)
        optimizer.zero_grad()
        output = model(data)
        loss = F.nll_loss(output, target)
        loss.backward()
        optimizer.step()
        if batch_idx % 10 == 0:
            print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}'.format(
                epoch, batch_idx * len(data), len(train_loader.dataset),

                100. * batch_idx / len(train_loader), loss.data[0]))


def test():
    model.eval()
    test_loss = 0
    correct = 0
    for batch_idx, (data, target) in enumerate(test_loader):
        # data, target = data.cuda(async=True), target.cuda(async=True) # On GPU
        data = Variable(data, volatile=True)
        target = Variable(target, volatile=True)
        output = model(data)
        # sum up batch loss
        test_loss += F.nll_loss(output, target, size_average=False).data[0]
        # get the index of the max log-probability
        pred = output.data.max(1, keepdim=True)[1]
        correct += pred.eq(target.data.view_as(pred)).cpu().sum()

    test_loss /= len(test_x)
    run_words('thequickbrownfoxjumpedoverthelazydog')
    print('\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
        test_loss, correct, len(test_x),
        100. * correct / len(test_x)))


epochs = args.epochs + 1
print('epochs', epochs)
for epoch in range(1, epochs):
    train(epoch)
    test()
    torch.save(model, model_path)
    run_words('thequickbrownfoxjumpedoverthelazydog')
