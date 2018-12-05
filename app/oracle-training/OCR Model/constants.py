import os


# Current working directory
dir_path = os.path.dirname(os.path.realpath(__file__))

# All supported characters
# This MUST exactly match the character list used for training, in the same order!
all_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?;:@[]'\"()-#$*"
num_chars = len(all_chars)


