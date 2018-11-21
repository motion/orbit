import os
import sys

where_am_i = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, where_am_i+"/python_modules")


def run_annoy():
    from annoyrun import annoy
    annoy()


run_annoy()
