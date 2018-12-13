from net import model
from constants import dir_path, num_chars
from keras.models import load_model
import numpy as np
import coremltools

 
# Extract training data from file
with open(dir_path + '/data/training-data.txt') as training_file:
    training_data = training_file.read()

# Split file by newline characters
training_images = training_data.split('\n\n')

# Allocate NumPy arrays for training data
x_train = np.zeros((len(training_images), 28, 28, 1), dtype=np.float32)
y_train = np.zeros((len(training_images), num_chars), dtype=np.float32)


# Populate training arrays
print("Populating training data...")
for image_index, image in enumerate(training_images):
    # 1st line contains metadata, 2nd line contains pixel data
    image_data = image.split('\n')

    metadata = image_data[0].split(' ')
    char_index = int(metadata[0])
    y_train[image_index, char_index] = 1 
    # height_index = metadata[1]
    # position_index = metadata[2]

    pixels = [float(x) for x in image_data[1].split(' ')]
    for row in range(28):
        for col in range(28):
            x_train[image_index, row, col, 0] = 1.0 - pixels[row * 28 + col]


# Train
print("Training model...")
model.fit(x_train, y_train,
    batch_size=64,
    epochs=12,
    verbose=1,
    validation_split=0.2,
    shuffle=True
)


# Save model
print("Saving Keras model...")
model.save(dir_path + '/ocr_model.h5')


print("Converting Keras model to CoreML format...")
coreml_model = coremltools.converters.keras.convert(
    dir_path + '/ocr_model.h5',
    input_names='image',
    image_input_names='image',
    image_scale=1/255.0,
    output_names='classification'
)

print("Saving CoreML model...")
coreml_model.save(dir_path + '/OCRModel.mlmodel')


# Switch Double input/outputs to Float32

# def update_multiarray_to_float32(feature):  
#     if feature.type.HasField('multiArrayType'):  
#         import coremltools.proto.FeatureTypes_pb2 as _ft  
#         feature.type.multiArrayType.dataType = _ft.ArrayFeatureType.FLOAT32  

# input_model_path = dir_path + '/OCRModel.mlmodel'
# output_model_path = dir_path + '/OCRModel.mlmodel'

# spec = coremltools.utils.load_spec(input_model_path)  

# for input_feature in spec.description.input:  
#     update_multiarray_to_float32(input_feature)  

# for output_feature in spec.description.output:  
#     update_multiarray_to_float32(output_feature)  

# coremltools.utils.save_spec(spec, output_model_path) 


print("Done")