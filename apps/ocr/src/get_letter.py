import torch

from PIL import Image, ImageChops, ImageFont, ImageDraw
from constants import font_path

# for letter in list(letters):
def trim(im, border):
    bg = Image.new(im.mode, im.size, border)
    diff = ImageChops.difference(im, bg)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)

def get_letter(font, letter, save = False):
  img = Image.new("L", (58, 58), color="white")
  draw = ImageDraw.Draw(img)
  # use a truetype font
  font = ImageFont.truetype(font_path + '/' + font, 30)

  draw.text((1, -2), letter, font=font)

  img = trim(img, "white")
  img = img.resize((28, 28))
  rgb = img.convert('RGB')
  t = torch.zeros(1, 28, 28)
  output = []
  for row in range(28):
    for col in range(28):
      r, g, b = rgb.getpixel((row, col))
      r = r / 255
      g = g / 255
      b = b / 255
      # intensity out of one
      t[0, row, col] = (r + b + b) / 3

  if save:
    img.save('./letters/' + letter + '.png')

  return t
