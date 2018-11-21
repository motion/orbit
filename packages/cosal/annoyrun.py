from annoy import AnnoyIndex
import json
import os

annoy_file = os.environ['DB_FILE']


def annoy():
    f = 100  # Length of item vector that will be indexed
    t = AnnoyIndex(f)

    if os.environ.get('SCAN', False):
        db = json.loads(open(os.environ['DB_FILE']).read())
        rows = db[os.environ['DB_NAME']]['indexToVector']

        for i in range(len(rows)):
            v = rows[i]
            t.add_item(i, v)

        t.build(10)  # 10 trees
        t.save(annoy_file)
        return

    t.load(annoy_file)  # super fast, will just mmap the file

    if os.environ.get('SEARCH', False):
        vector = json.loads(os.environ['VECTOR'])
        print(json.dumps(t.get_nns_by_vector(
            vector, int(os.environ['COUNT']), -1, True)))

    if os.environ.get('RELATED', False):
        print(json.dumps(t.get_nns_by_vector(
            int(os.environ['INDEX']), int(os.environ['COUNT']))))
