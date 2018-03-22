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
from pprint import pprint
from helpers import load
from model import autoencoder

words, vectors = load()

num_epochs = 100
batch_size = 40
learning_rate = 1e-3

class UnlabeledTensorDataset(TensorDataset):
    """Dataset wrapping unlabeled data tensors.

    Each sample will be retrieved by indexing tensors along the first
    dimension.

    Arguments:
        data_tensor (Tensor): contains sample data.
    """
    def __init__(self, data_tensor):
        self.data_tensor = data_tensor

    def __getitem__(self, index):
        return self.data_tensor[index]

    def __len__(self):
      return len(self.data_tensor)

train_set = UnlabeledTensorDataset(vectors)
dataloader = torch.utils.data.DataLoader(
    train_set, batch_size=batch_size, shuffle=True, num_workers=2)

model = autoencoder()
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(
    model.parameters(), lr=learning_rate, weight_decay=1e-5)

for epoch in range(num_epochs):
    for data in dataloader:
        X = Variable(data)
        # ===================forward=====================
        output = model(X)
        loss = criterion(output, X)
        # ===================backward====================
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    # ===================log========================
    print('epoch [{}/{}], loss:{:.4f}'
          .format(epoch + 1, num_epochs, loss.data[0]))

    if epoch % 10 == 0:
        torch.save(model.state_dict(), './model.pth')

torch.save(model.state_dict(), './model.pth')