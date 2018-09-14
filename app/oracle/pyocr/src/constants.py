import os

dir_path = os.path.dirname(os.path.realpath(__file__))

font_path = dir_path + '/../../../train'
# letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

letters = "123*',;:.?!#$thequickbrownfoxjumpsoverthe*a'b,c;d:e.f?g!h#i$j[k]l(m)lazydogCwmFJORDBANKGLyphsVEXTlazydogpackmyboxwithPACKMYBOXQuizJackdawslovefoivedozenliuorJACKDAWSLOVEmybigsphinxofquartz123456789012345678901234567890abcdegh#$[k]l(m)opqrstuvwxyz1234567890abcdefehklmnorstuvwxzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefeghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ*a'b,c;d:e.f?g!h#i$j[k]l(m)opqrstuvwxyzthequckbrownfoxumpsoverthelazydogCwmFJORDBANKGLyphsVEXTQuizfoivedozenliuorusxcsPACKMYBOXWITHJackdawsloveJACKDAWSLOVEmybigsphinxofquartz12345678901234567890"

ocr_path = dir_path + '/../data/ocr.csv'
model_path = dir_path + '/../models/model.pyt'

uniqueLetters = len(set(letters))
