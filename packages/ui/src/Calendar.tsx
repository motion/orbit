import { Contents } from 'gloss'
import React from 'react'
import { DateRangePicker } from 'react-date-range'

import { memoIsEqualDeep } from './helpers/memoHelpers'

export const Calendar = memoIsEqualDeep(props => {
  return (
    <Contents className="calendar-dom">
      <DateRangePicker ranges={[]} {...props} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .calendar-dom .rdrCalendarWrapper {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            background: #ffffff;
            display: -webkit-inline-box;
            display: -ms-inline-flexbox;
            display: inline-flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          .calendar-dom .rdrDateDisplay {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }

          .calendar-dom .rdrDateDisplayItem {
            -webkit-box-flex: 1;
            -ms-flex: 1 1;
            flex: 1 1;
            width: 0;
            text-align: center;
            color: inherit;
          }

          .calendar-dom .rdrDateDisplayItem + .rdrDateDisplayItem {
            margin-left: 0.833em;
          }

          .calendar-dom .rdrDateDisplayItem input {
            text-align: inherit;
          }

          .calendar-dom .rdrDateDisplayItem input:disabled {
            cursor: default;
          }

          .calendar-dom .rdrDateDisplayItemActive {
          }

          .calendar-dom .rdrMonthAndYearWrapper {
            -webkit-box-sizing: inherit;
            box-sizing: inherit;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }

          .calendar-dom .rdrMonthAndYearPickers {
            -webkit-box-flex: 1;
            -ms-flex: 1 1 auto;
            flex: 1 1 auto;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
          }

          .calendar-dom .rdrMonthPicker {
          }

          .calendar-dom .rdrYearPicker {
          }

          .calendar-dom .rdrNextPrevButton {
            -webkit-box-sizing: inherit;
            box-sizing: inherit;
            cursor: pointer;
            outline: none;
          }

          .calendar-dom .rdrPprevButton {
          }

          .calendar-dom .rdrNextButton {
          }

          .calendar-dom .rdrMonths {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
          }

          .calendar-dom .rdrMonthsVertical {
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
          }

          .calendar-dom .rdrMonthsHorizontal > div > div > div {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-direction: row;
            flex-direction: row;
          }

          .calendar-dom .rdrMonth {
            width: 27.667em;
          }

          .calendar-dom .rdrWeekDays {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
          }

          .calendar-dom .rdrWeekDay {
            -ms-flex-preferred-size: calc(100% / 7);
            flex-basis: calc(100% / 7);
            -webkit-box-sizing: inherit;
            box-sizing: inherit;
            text-align: center;
          }

          .calendar-dom .rdrDays {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
          }

          .calendar-dom .rdrDateDisplayWrapper {
          }

          .calendar-dom .rdrMonthName {
          }

          .calendar-dom .rdrInfiniteMonths {
            overflow: auto;
          }

          .calendar-dom .rdrDateRangeWrapper {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          .calendar-dom .rdrDay {
            -webkit-box-sizing: inherit;
            box-sizing: inherit;
            width: calc(100% / 7);
            position: relative;
            font: inherit;
            cursor: pointer;
          }

          .calendar-dom .rdrDayNumber {
            display: block;
            position: relative;
          }

          .calendar-dom .rdrDayNumber span {
            color: #1d2429;
          }

          .calendar-dom .rdrDayDisabled {
            cursor: not-allowed;
          }

          .calendar-dom .rdrSelected,
          .rdrInRange,
          .rdrStartEdge,
          .rdrEndEdge {
            pointer-events: none;
          }

          .calendar-dom .rdrInRange {
          }

          .calendar-dom .rdrDayStartPreview,
          .rdrDayInPreview,
          .rdrDayEndPreview {
            pointer-events: none;
          }

          .calendar-dom .rdrDayHovered {
          }

          .calendar-dom .rdrDayActive {
          }

          .calendar-dom .rdrDateRangePickerWrapper {
            display: -webkit-inline-box;
            display: -ms-inline-flexbox;
            display: inline-flex;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          .calendar-dom .rdrDefinedRangesWrapper {
          }

          .calendar-dom .rdrStaticRanges {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
          }

          .calendar-dom .rdrStaticRange {
            font-size: inherit;
          }

          .calendar-dom .rdrStaticRangeLabel {
          }

          .calendar-dom .rdrInputRanges {
          }

          .calendar-dom .rdrInputRange {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
          }

          .calendar-dom .rdrInputRangeInput {
          }

`,
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .calendar-dom .rdrCalendarWrapper {
            color: #000000;
            font-size: 12px;
          }

          .calendar-dom .rdrDateDisplay {
            background-color: rgb(239, 242, 247);
            padding: 0.833em;
          }

          .calendar-dom .rdrDateDisplayItem {
            border-radius: 4px;
            background-color: rgb(255, 255, 255);
            -webkit-box-shadow: 0 1px 2px 0 rgba(35, 57, 66, 0.21);
            box-shadow: 0 1px 2px 0 rgba(35, 57, 66, 0.21);
            border: 1px solid transparent;
          }

          .calendar-dom .rdrDateDisplayItem input {
            cursor: pointer;
            height: 2.5em;
            line-height: 2.5em;
            border: 0px;
            background: transparent;
            width: 100%;
            color: #849095;
          }

          .calendar-dom .rdrDateDisplayItemActive {
            border-color: currentColor;
          }

          .calendar-dom .rdrDateDisplayItemActive input {
            color: #7d888d;
          }

          .calendar-dom .rdrMonthAndYearWrapper {
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 60px;
            padding-top: 10px;
          }

          .calendar-dom .rdrMonthAndYearPickers {
            font-weight: 600;
          }

          .calendar-dom .rdrMonthAndYearPickers select {
            -moz-appearance: none;
            appearance: none;
            -webkit-appearance: none;
            border: 0;
            background: transparent;
            padding: 10px 30px 10px 10px;
            border-radius: 4px;
            outline: 0;
            color: #3e484f;
            background: url("data:image/svg+xml;utf8,<svg width='9px' height='6px' viewBox='0 0 9 6' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g id='Artboard' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' transform='translate(-636.000000, -171.000000)' fill-opacity='0.368716033'><g id='input' transform='translate(172.000000, 37.000000)' fill='%230E242F' fill-rule='nonzero'><g id='Group-9' transform='translate(323.000000, 127.000000)'><path d='M142.280245,7.23952813 C141.987305,6.92353472 141.512432,6.92361662 141.219585,7.23971106 C140.926739,7.5558055 140.926815,8.06821394 141.219755,8.38420735 L145.498801,13 L149.780245,8.38162071 C150.073185,8.0656273 150.073261,7.55321886 149.780415,7.23712442 C149.487568,6.92102998 149.012695,6.92094808 148.719755,7.23694149 L145.498801,10.7113732 L142.280245,7.23952813 Z' id='arrow'></path></g></g></g></svg>")
              no-repeat;
            background-position: right 8px center;
            cursor: pointer;
            text-align: center;
          }

          .calendar-dom .rdrMonthAndYearPickers select:hover {
            background-color: rgba(0, 0, 0, 0.07);
          }

          .calendar-dom .rdrMonthPicker,
          .rdrYearPicker {
            margin: 0 5px;
          }

          .calendar-dom .rdrNextPrevButton {
            display: block;
            width: 24px;
            height: 24px;
            margin: 0 0.833em;
            padding: 0;
            border: 0;
            border-radius: 5px;
            background: #eff2f7;
          }

          .calendar-dom .rdrNextPrevButton:hover {
            background: #e1e7f0;
          }

          .calendar-dom .rdrNextPrevButton i {
            display: block;
            width: 0;
            height: 0;
            padding: 0;
            text-align: center;
            border-style: solid;
            margin: auto;
            -webkit-transform: translate(-3px, 0px);
            transform: translate(-3px, 0px);
          }

          .calendar-dom .rdrPprevButton i {
            border-width: 4px 6px 4px 4px;
            border-color: transparent rgb(52, 73, 94) transparent transparent;
            -webkit-transform: translate(-3px, 0px);
            transform: translate(-3px, 0px);
          }

          .calendar-dom .rdrNextButton i {
            margin: 0 0 0 7px;
            border-width: 4px 4px 4px 6px;
            border-color: transparent transparent transparent rgb(52, 73, 94);
            -webkit-transform: translate(3px, 0px);
            transform: translate(3px, 0px);
          }

          .calendar-dom .rdrWeekDays {
            padding: 0 0.833em;
          }

          .calendar-dom .rdrMonth {
            padding: 0 0.833em 1.666em 0.833em;
          }

          .calendar-dom .rdrMonth .rdrWeekDays {
            padding: 0;
          }

          .calendar-dom .rdrMonths.rdrMonthsVertical .rdrMonth:first-child .rdrMonthName {
            display: none;
          }

          .calendar-dom .rdrWeekDay {
            font-weight: 400;
            line-height: 2.667em;
            color: rgb(132, 144, 149);
          }

          .calendar-dom .rdrDay {
            background: transparent;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border: 0;
            padding: 0;
            line-height: 3em;
            height: 3em;
            text-align: center;
            color: #1d2429;
          }

          .calendar-dom .rdrDay:focus {
            outline: 0;
          }

          .calendar-dom .rdrDayNumber {
            outline: 0;
            font-weight: 300;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            top: 5px;
            bottom: 5px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
          }

          .calendar-dom .rdrDayToday .rdrDayNumber span {
            font-weight: 500;
          }

          .calendar-dom .rdrDayToday .rdrDayNumber span:after {
            content: '';
            position: absolute;
            bottom: 4px;
            left: 50%;
            -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0);
            width: 18px;
            height: 2px;
            border-radius: 2px;
            background: #3d91ff;
          }

          .calendar-dom .rdrDayToday:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span:after,
          .rdrDayToday:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span:after,
          .rdrDayToday:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span:after,
          .rdrDayToday:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span:after {
            background: #fff;
          }

          .calendar-dom .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span,
          .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
          .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span,
          .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span {
            color: rgba(255, 255, 255, 0.85);
          }

          .calendar-dom .rdrSelected,
          .rdrInRange,
          .rdrStartEdge,
          .rdrEndEdge {
            background: currentColor;
            position: absolute;
            top: 5px;
            left: 0;
            right: 0;
            bottom: 5px;
          }

          .calendar-dom .rdrSelected {
            left: 2px;
            right: 2px;
          }

          .calendar-dom .rdrInRange {
          }

          .calendar-dom .rdrStartEdge {
            border-top-left-radius: 1.042em;
            border-bottom-left-radius: 1.042em;
            left: 2px;
          }

          .calendar-dom .rdrEndEdge {
            border-top-right-radius: 1.042em;
            border-bottom-right-radius: 1.042em;
            right: 2px;
          }

          .calendar-dom .rdrSelected {
            border-radius: 1.042em;
          }

          .calendar-dom .rdrDayStartOfMonth .rdrInRange,
          .rdrDayStartOfMonth .rdrEndEdge,
          .rdrDayStartOfWeek .rdrInRange,
          .rdrDayStartOfWeek .rdrEndEdge {
            border-top-left-radius: 1.042em;
            border-bottom-left-radius: 1.042em;
            left: 2px;
          }

          .calendar-dom .rdrDayEndOfMonth .rdrInRange,
          .rdrDayEndOfMonth .rdrStartEdge,
          .rdrDayEndOfWeek .rdrInRange,
          .rdrDayEndOfWeek .rdrStartEdge {
            border-top-right-radius: 1.042em;
            border-bottom-right-radius: 1.042em;
            right: 2px;
          }

          .calendar-dom .rdrDayStartOfMonth .rdrDayInPreview,
          .rdrDayStartOfMonth .rdrDayEndPreview,
          .rdrDayStartOfWeek .rdrDayInPreview,
          .rdrDayStartOfWeek .rdrDayEndPreview {
            border-top-left-radius: 1.333em;
            border-bottom-left-radius: 1.333em;
            border-left-width: 1px;
            left: 0px;
          }

          .calendar-dom .rdrDayEndOfMonth .rdrDayInPreview,
          .rdrDayEndOfMonth .rdrDayStartPreview,
          .rdrDayEndOfWeek .rdrDayInPreview,
          .rdrDayEndOfWeek .rdrDayStartPreview {
            border-top-right-radius: 1.333em;
            border-bottom-right-radius: 1.333em;
            border-right-width: 1px;
            right: 0px;
          }

          .calendar-dom .rdrDayStartPreview,
          .rdrDayInPreview,
          .rdrDayEndPreview {
            background: rgba(255, 255, 255, 0.09);
            position: absolute;
            top: 3px;
            left: 0px;
            right: 0px;
            bottom: 3px;
            pointer-events: none;
            border: 0px solid currentColor;
            z-index: 1;
          }

          .calendar-dom .rdrDayStartPreview {
            border-top-width: 1px;
            border-left-width: 1px;
            border-bottom-width: 1px;
            border-top-left-radius: 1.333em;
            border-bottom-left-radius: 1.333em;
            left: 0px;
          }

          .calendar-dom .rdrDayInPreview {
            border-top-width: 1px;
            border-bottom-width: 1px;
          }

          .calendar-dom .rdrDayEndPreview {
            border-top-width: 1px;
            border-right-width: 1px;
            border-bottom-width: 1px;
            border-top-right-radius: 1.333em;
            border-bottom-right-radius: 1.333em;
            right: 2px;
            right: 0px;
          }

          .calendar-dom .rdrDefinedRangesWrapper {
            font-size: 12px;
            width: 226px;
            border-right: solid 1px #eff2f7;
            background: #fff;
          }

          .calendar-dom .rdrDefinedRangesWrapper .rdrStaticRangeSelected {
            color: currentColor;
            font-weight: 600;
          }

          .calendar-dom .rdrStaticRange {
            border: 0;
            cursor: pointer;
            display: block;
            outline: 0;
            border-bottom: 1px solid #eff2f7;
            padding: 0;
            background: #fff;
          }

          .calendar-dom .rdrStaticRange:hover .rdrStaticRangeLabel,
          .rdrStaticRange:focus .rdrStaticRangeLabel {
            background: #eff2f7;
          }

          .calendar-dom .rdrStaticRangeLabel {
            display: block;
            outline: 0;
            line-height: 18px;
            padding: 10px 20px;
            text-align: left;
          }

          .calendar-dom .rdrInputRanges {
            padding: 10px 0;
          }

          .calendar-dom .rdrInputRange {
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            padding: 5px 20px;
          }

          .calendar-dom .rdrInputRangeInput {
            width: 30px;
            height: 30px;
            line-height: 30px;
            border-radius: 4px;
            text-align: center;
            border: solid 1px rgb(222, 231, 235);
            margin-right: 10px;
            color: rgb(108, 118, 122);
          }

          .calendar-dom .rdrInputRangeInput:focus,
          .rdrInputRangeInput:hover {
            border-color: rgb(180, 191, 196);
            outline: 0;
            color: #333;
          }

          .calendar-dom .rdrCalendarWrapper:not(.rdrDateRangeWrapper) .rdrDayHovered .rdrDayNumber:after {
            content: '';
            border: 1px solid currentColor;
            border-radius: 1.333em;
            position: absolute;
            top: -2px;
            bottom: -2px;
            left: 0px;
            right: 0px;
            background: transparent;
          }

          .calendar-dom .rdrDayPassive {
            pointer-events: none;
          }

          .calendar-dom .rdrDayPassive .rdrDayNumber span {
            color: #d5dce0;
          }

          .calendar-dom .rdrDayPassive .rdrInRange,
          .rdrDayPassive .rdrStartEdge,
          .rdrDayPassive .rdrEndEdge,
          .rdrDayPassive .rdrSelected,
          .rdrDayPassive .rdrDayStartPreview,
          .rdrDayPassive .rdrDayInPreview,
          .rdrDayPassive .rdrDayEndPreview {
            display: none;
          }

          .calendar-dom .rdrDayDisabled {
            background-color: rgb(248, 248, 248);
          }

          .calendar-dom .rdrDayDisabled .rdrDayNumber span {
            color: #aeb9bf;
          }

          .calendar-dom .rdrDayDisabled .rdrInRange,
          .rdrDayDisabled .rdrStartEdge,
          .rdrDayDisabled .rdrEndEdge,
          .rdrDayDisabled .rdrSelected,
          .rdrDayDisabled .rdrDayStartPreview,
          .rdrDayDisabled .rdrDayInPreview,
          .rdrDayDisabled .rdrDayEndPreview {
            -webkit-filter: grayscale(100%) opacity(60%);
            filter: grayscale(100%) opacity(60%);
          }

          .calendar-dom .rdrMonthName {
            text-align: left;
            font-weight: 600;
            color: #849095;
            padding: 0.833em;
          }
          `,
        }}
      />
    </Contents>
  )
})
