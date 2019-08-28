import * as React from 'react'
import styled from 'styled-components'

import { SlateNodeProps as Props } from '../../types'
import { Grip } from './Grip'
import { Toolbar } from './Toolbar'

export class Cell extends React.Component<Props> {
  cell?: HTMLElement

  render() {
    const { children, editor, readOnly, attributes, node } = this.props
    const { document } = editor.value

    const position = editor.getPositionByKey(document, node.key)
    const isFirstRow = position.isFirstRow()
    const isFirstColumn = position.isFirstColumn()
    const isLastRow = position.isLastRow()
    const isLastColumn = position.isLastColumn()
    const isSelected = node.data.get('selected')
    const isTableSelected = position.table.data.get('selectedTable')
    const isActive = editor.isSelectionInTable() && !isTableSelected
    const selectedRows = position.table.data.get('selectedRows')
    const selectedColumns = position.table.data.get('selectedColumns')
    const isRowSelected = selectedRows && selectedRows.includes(position.getRowIndex())
    const isColumnSelected = selectedColumns && selectedColumns.includes(position.getColumnIndex())

    return (
      <StyledTd
        ref={ref => (this.cell = ref)}
        isFirstRow={isFirstRow}
        isFirstColumn={isFirstColumn}
        isSelected={isSelected}
        onClick={() => editor.clearSelected(position.table)}
        {...attributes}
      >
        {!readOnly && (
          <>
            {isFirstColumn && isFirstRow && (
              <>
                <GripTable
                  contentEditable={false}
                  isSelected={isTableSelected}
                  onClick={ev => {
                    ev.preventDefault()
                    ev.stopPropagation()

                    if (isTableSelected) {
                      editor.clearSelected(position.table)
                    } else {
                      editor.selectAll().blur()
                    }
                  }}
                />
                <Toolbar editor={editor} cell={this.cell} active={isTableSelected} type="table" />
              </>
            )}
            {isFirstColumn && (
              <>
                <GripRow
                  isFirstRow={isFirstRow}
                  isLastRow={isLastRow}
                  isSelected={isRowSelected}
                  contentEditable={false}
                  onClick={ev => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    editor.selectRow(!isSelected || isTableSelected).blur()
                  }}
                />
                {isActive && (
                  <Toolbar editor={editor} cell={this.cell} active={isRowSelected} type="row" />
                )}
              </>
            )}
            {isFirstRow && (
              <>
                <GripColumn
                  isFirstColumn={isFirstColumn}
                  isLastColumn={isLastColumn}
                  isSelected={isColumnSelected}
                  contentEditable={false}
                  onClick={ev => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    editor.selectColumn(!isSelected || isTableSelected).blur()
                  }}
                />
                {isActive && (
                  <Toolbar
                    editor={editor}
                    cell={this.cell}
                    active={isColumnSelected}
                    type="column"
                  />
                )}
              </>
            )}
          </>
        )}

        <RowContent align={node.data.get('align')}>{children}</RowContent>
      </StyledTd>
    )
  }
}

export const GripTable = styled(Grip)`
  width: 13px;
  height: 13px;
  border-radius: 13px;
  border: 2px solid ${props => props.theme.background};

  position: absolute;
  top: -18px;
  left: -18px;
`

export const GripRow = styled(Grip)`
  left: -16px;
  top: 0px;
  height: 100%;
  width: 12px;
  border-right: 3px solid ${props => props.theme.background};

  ${props =>
    props.isFirstRow &&
    `
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  `}

  ${props =>
    props.isLastRow &&
    `
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  `}
`

export const GripColumn = styled(Grip)`
  top: -16px;
  left: 0px;
  width: 100%;
  height: 12px;
  border-bottom: 3px solid ${props => props.theme.background};

  ${props =>
    props.isFirstColumn &&
    `
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
`}

  ${props =>
    props.isLastColumn &&
    `
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
`}
`

const RowContent = styled.div`
  padding: 4px 12px;
  text-align: ${props => props.align};
`

const StyledTd = styled.td`
  vertical-align: top;
  border-right: 1px solid ${props => props.theme.tableDivider};
  position: relative;
  background: ${props =>
    props.isSelected ? props.theme.tableSelectedBackground : props.theme.background};

  ${props =>
    props.isFirstRow &&
    `
  min-width: 100px;
  `}
`
