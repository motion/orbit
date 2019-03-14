import { sortPanes } from './paneManagerPaneSort'

test('adds 1 + 2 to equal 3', () => {
  expect(
    sortPanes({ paneSort: [] }, [
      { id: 0, tabDisplay: 'pinned', name: 'Third', target: 'app' },
      { id: 1, tabDisplay: 'plain', name: 'Second', target: 'app' },
      { id: 2, tabDisplay: 'permanent', name: 'First', target: 'app' },
    ]),
  ).toBe([2, 1, 0])
})
