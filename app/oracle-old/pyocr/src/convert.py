import coremltools
from constants import model_path

coreml_model = coremltools.converters.keras.convert(model_path)
coreml_model.save('HeightWeight_model.mlmodel')
