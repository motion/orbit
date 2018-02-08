import random
import math

import os
from os.path import isfile, join
from constants import font_path

fonts = ['helvetica', 'georgia']  # [x[1] for x in os.walk(font_path)][0]

print("fonts are" + str(fonts))

random.shuffle(fonts)
train_count = math.floor(len(fonts) * .9)
train_fonts = fonts[:train_count]
test_fonts = fonts[train_count:]
