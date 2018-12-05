from keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense
from keras.layers.merge import concatenate
from keras.models import Model
from keras import losses, optimizers
from keras import activations
from keras.utils.vis_utils import plot_model
from constants import num_chars



# Image input (pixels)
image_input = Input(
    shape=(28, 28, 1),
    # batch_shape=(32, 28, 28, 1)
)

# Metadata input
meta_input = Input(
    shape=(6,),
    # batch_shape=(32, 2)
)


# 2D convolution
conv1 = Conv2D(
    32,
    kernel_size=5,
    input_shape=(28, 28, 1),
    activation='relu'
)(image_input)

# 2D max pooling
maxPool1 = MaxPooling2D(pool_size=2)(conv1)

# 2D convolution
conv2 = Conv2D(
    64,
    kernel_size=5,
    activation='relu'
)(maxPool1)

# 2D max pooling
maxPool2 = MaxPooling2D(pool_size=2)(conv2)

# Flatten
flatten = Flatten()(maxPool2)

# Merge convolution output with metadata input
merge = concatenate([flatten, meta_input])

# Fully connected
dense1 = Dense(
    1000,
    activation='relu'
)(merge)

# Fully connected (classification)
dense2 = Dense(
    num_chars,
    activation='softmax'
)(dense1)

# Construct model
model = Model(
    inputs=[image_input, meta_input],
    outputs=dense2
)


# Summarize layers
# print(model.summary())
# Plot graph
# plot_model(model, to_file='/Users/Collin/Documents/Orbit/OCR Model/model.png')


# Compile model
model.compile(
    loss=losses.categorical_crossentropy,
    optimizer=optimizers.SGD(lr=0.01, momentum=0.9, nesterov=True),
    metrics=['accuracy']
)


