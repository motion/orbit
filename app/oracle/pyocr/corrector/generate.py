#!/usr/bin/env python
# https://github.com/spro/char-rnn.pytorch

from collections import Counter
import torch
import os
import argparse

from helpers import *
from model import *

def generate(decoder, prime_str='A', predict_len=100, temperature=0.8):
    hidden = decoder.init_hidden(1)
    prime_input = Variable(char_tensor(prime_str).unsqueeze(0))

    predicted = prime_str

    # Use priming string to "build up" hidden state
    for p in range(len(prime_str) - 1):
        _, hidden = decoder(prime_input[:,p], hidden)
        
    inp = prime_input[:,-1]
    
    p = 0
    output, hidden = decoder(inp, hidden)
    
    # Sample from the network as a multinomial distribution
    output_dist = output.data.view(-1).div(temperature).exp()
    top_i = torch.multinomial(output_dist, 1)[0]
    start = time.time()
    preds = list(torch.multinomial(output_dist, 100, replacement = True))
    counts = Counter(preds)
    # remove space
    counts.pop(94, None)
    count_list = [({ "char": all_characters[key], "keyCode": key, "count": counts[key] })  for key in counts.keys()]
    count_list.sort(reverse=True, key=lambda x: x['count'])
    count_list = count_list[:4]
    total_count = sum(map(lambda x: x['count'], count_list))
    count_list_norm = [{ "char": x['char'], "count": x['count'] / total_count } for x in count_list]

    print('list is', count_list_norm)

    print('took ', time.time()-start)

    # Add predicted character to string and use as next input
    predicted_char = all_characters[top_i]
    predicted += predicted_char
    inp = Variable(char_tensor(predicted_char).unsqueeze(0))

    return predicted

# Run as standalone script
if __name__ == '__main__':

# Parse command line arguments
    argparser = argparse.ArgumentParser()
    argparser.add_argument('filename', type=str)
    argparser.add_argument('-p', '--prime_str', type=str, default='A')
    argparser.add_argument('-l', '--predict_len', type=int, default=100)
    argparser.add_argument('-t', '--temperature', type=float, default=0.8)
    args = argparser.parse_args()

    decoder = torch.load(args.filename)
    del args.filename
    generate(decoder, **vars(args))

