from annoy import AnnoyIndex
import json


def annoy():
    f = 100  # Length of item vector that will be indexed
    t = AnnoyIndex(f)

    rows = json.loads(open('./vectors.json').read())

    for i in range(len(rows)):
        v = rows[i]
        t.add_item(i, v)

    t.build(10)  # 10 trees
    t.save('test.ann')

    u = AnnoyIndex(f)
    u.load('test.ann')  # super fast, will just mmap the file

    print(u.get_nns_by_item(0, 2))  # will find the 1000 nearest neighbors
