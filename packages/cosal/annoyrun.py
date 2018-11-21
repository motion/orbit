from annoy import AnnoyIndex
import json
import os


def annoy():
    f = 100  # Length of item vector that will be indexed
    t = AnnoyIndex(f)

    if os.environ["SCAN"]:
        rows = json.loads(open(os.environ['DB_FILE']).read())

        for i in range(len(rows)):
            v = rows[i]
            t.add_item(i, v)

        t.build(10)  # 10 trees
        t.save('./app_data/test.ann')

    else:
        t.load('./app_data/test.ann')  # super fast, will just mmap the file

    if os.environ["VECTOR"]:
        vector = json.loads(os.environ['VECTOR'])
        print(json.dumps(t.get_nns_by_vector(
            vector, int(os.environ["COUNT"]), -1, True)))

    # print(u.get_nns_by_item(0, 10))  # will find the 1000 nearest neighbors
