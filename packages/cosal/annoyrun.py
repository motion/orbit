from annoy import AnnoyIndex
import json
import os


def annoy():
    f = 100  # Length of item vector that will be indexed
    t = AnnoyIndex(f, "angular")

    if os.environ['DB_FILE']:
        db = json.loads(open(os.environ['DB_FILE']).read())
        rows = db['covariance']['matrix']

        for i in range(len(rows)):
            v = rows[i]
            t.add_item(i, v)

        t.build(10)  # 10 trees
        t.save('./app_data/test.ann')

    # u = AnnoyIndex(f)
    # u.load('./app_data/test.ann')  # super fast, will just mmap the file

    vector = json.loads(os.environ['VECTOR'])
    print(json.dumps(t.get_nns_by_vector(vector, 10)))

    # print(u.get_nns_by_item(0, 2))  # will find the 1000 nearest neighbors
