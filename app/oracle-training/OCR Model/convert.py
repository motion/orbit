from keras.models import load_model
from constants import dir_path
import coremltools


# ----- CONVERT KERAS MODEL TO COREML FORMAT -----

print("Converting model to CoreML format...")
coreml_model = coremltools.converters.keras.convert(
    dir_path + '/ocr_model.h5',
    input_names='image',
    output_names='classification'
)

print("Saving model...")
coreml_model.save(dir_path + '/OCRModel.mlmodel')


# Switch Double input/outputs to Float32

def update_multiarray_to_float32(feature):  
    if feature.type.HasField('multiArrayType'):  
        import coremltools.proto.FeatureTypes_pb2 as _ft  
        feature.type.multiArrayType.dataType = _ft.ArrayFeatureType.FLOAT32  

input_model_path = dir_path + '/OCRModel.mlmodel'
output_model_path = dir_path + '/OCRModel.mlmodel'

spec = coremltools.utils.load_spec(input_model_path)  

for input_feature in spec.description.input:  
    update_multiarray_to_float32(input_feature)  

for output_feature in spec.description.output:  
    update_multiarray_to_float32(output_feature)  

coremltools.utils.save_spec(spec, output_model_path) 


print("Done")