from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization, Activation
from keras import losses, optimizers
from keras import activations
from constants import num_chars


# Create model
model = Sequential()


# ----- Add layers -----

# 2D convolution
model.add(Conv2D(
    32,
    kernel_size=3,
    input_shape=(28, 28, 1),
    activation='relu'
    ))

# Batch normalization
model.add(BatchNormalization())

# 2D max pooling
model.add(MaxPooling2D(
    pool_size=2
    ))

# 2D convolution
model.add(Conv2D(
    64,
    kernel_size=3,
    input_shape=(28, 28, 1),
    activation='relu'
    ))

# Batch normalization
model.add(BatchNormalization())

# 2D max pooling
model.add(MaxPooling2D(
    pool_size=2
    ))

# Flatten
model.add(Flatten())

# Fully connected
model.add(Dense(
    512,
    activation='relu'
    ))

# Dropout
model.add(Dropout(
    0.4
))

# Fully connected (classification)
model.add(Dense(
    num_chars,
    activation='softmax'
    ))


# Compile model
model.compile(
    loss=losses.categorical_crossentropy,
    optimizer=optimizers.Adadelta(),
    metrics=['accuracy']
)


