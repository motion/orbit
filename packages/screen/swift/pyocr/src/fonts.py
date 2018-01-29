import random
import math

from os import listdir
from os.path import isfile, join
from constants import font_path

fonts = [f for f in listdir(font_path) if isfile(join(font_path, f))]
fonts.remove('helvetica.ttf')
random.shuffle(fonts)
train_count = math.floor(len(fonts) * .8)
train_fonts = fonts[:train_count]
test_fonts = fonts[train_count:]