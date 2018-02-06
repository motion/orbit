import random
import math

from os import listdir
from os.path import isfile, join
from constants import font_path

fonts = ['arial', 'georgia', 'verdana', 'rockwell',
         'avenir', 'century gothic', 'century schoolbook', 'eurostile', 'helvetica neue']
random.shuffle(fonts)
train_count = math.floor(len(fonts) * .8)
train_fonts = fonts[:train_count]
test_fonts = fonts[train_count:]
