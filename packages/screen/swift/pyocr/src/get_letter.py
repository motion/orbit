import torch

from PIL import Image, ImageChops, ImageFont, ImageDraw
from constants import font_path


def trim(im, border):
    bg = Image.new(im.mode, im.size, border)
    diff = ImageChops.difference(im, bg)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)


def get_letter(font, letterIndex, save=False):
    img = Image.open("/Users/nw/projects/motion/orbit/packages/screen/train/" +
                     font + "/tmp/c-" + letterIndex + ".png")
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
    # img.save('./letters/' + letterIndex + '.png')
    return t
