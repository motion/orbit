from constants import letters

import torch.nn as nn
import torch.nn.functional as F

uniqueLetters = len(set(letters))
print("uniqueLetters" + str(uniqueLetters))

# output = (W - K + 2P) / S + 1
# W = input height/length, K = filter size, P is padding, S is stride


class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, uniqueLetters, kernel_size=5)
        self.conv2 = nn.Conv2d(uniqueLetters, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d(p=0.2)
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, len(letters))

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fc1(x))
        x = F.dropout(x, p=0.1, training=self.training)
        x = F.relu(self.fc2(x))
        return F.log_softmax(x, dim=None)
