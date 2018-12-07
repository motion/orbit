# Contents

This directory contains the Keras training scripts used for the Oracle OCR model.

### Running

```swift
python3 train.py
```

This script will train the neural network using the data found at `data/training-data.txt`. The trained model will be saved as `OCRModel.mlmodel` in this directory.

### Files:
 - constants.py: Constants used during ML model training process.
 - net.py: Neural network definition.
 - train.py: NN training/conversion routine.
 
 Note: Any file ending in `_meta.py` is currently unused. These may be revisited in the future if we determine that manual metadata is beneficial to the net. 
