import { sortPanes } from './useManagePaneSort'

test('adds 1 + 2 to equal 3', () => {
  expect(
    sortPanes({ paneSort: [] }, [
      { id: 0, pinned: false, name: 'Third', target: 'app' },
      { id: 1, pinned: true, name: 'Second', target: 'app' },
      { id: 2, editable: false, name: 'First', target: 'app' },
    ]),
  ).toBe([2, 1, 0])
})
