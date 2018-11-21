from annoy import AnnoyIndex
import json
import os


def annoy():
    f = 100  # Length of item vector that will be indexed
    t = AnnoyIndex(f)

    if os.environ['DB_FILE']:
        rows = json.loads(open(os.environ['DB_FILE']).read())

        for i in range(len(rows)):
            v = rows[i]
            t.add_item(i, v)

        t.build(10)  # 10 trees
        t.save('./app_data/test.ann')

    # u = AnnoyIndex(f)
    # u.load('./app_data/test.ann')  # super fast, will just mmap the file

    vector = json.loads(os.environ['VECTOR'])

    # print("hiiiiii")
    print(json.dumps(t.get_nns_by_vector(vector, 5, -1, True)))

    # print(u.get_nns_by_item(0, 10))  # will find the 1000 nearest neighbors
