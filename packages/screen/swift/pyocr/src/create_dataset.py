
class CreateDataset():
    def __init__(self, x, y):
        self.X_train = x
        self.y_train = y

    def __getitem__(self, index):
        return self.X_train[index], self.y_train[index]

    def __len__(self):
        return len(self.X_train)
