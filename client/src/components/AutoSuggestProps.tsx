import { InputProps, RenderSuggestionParams } from 'react-autosuggest'
import React from 'react'
import deburr from 'lodash.deburr'
import TextField from '@material-ui/core/TextField'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import MenuItem from '@material-ui/core/MenuItem'

export interface Suggestion {
  label: string
}

export function renderInputComponent(inputProps: InputProps<Suggestion>): React.ReactNode {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps

  return (
    // @ts-ignore
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node)
          inputRef(node)
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  )
}

export function renderSuggestion(
  suggestion: Suggestion,
  { query, isHighlighted }: RenderSuggestionParams,
): React.ReactNode {
  const matches = match(suggestion.label, query)
  const parts = parse(suggestion.label, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )
        })}
      </div>
    </MenuItem>
  )
}

export function getSuggestionValue(suggestion: Suggestion): string {
  return suggestion.label
}

export function getSuggestions(value: string, suggestions: Suggestion[]): Suggestion[] {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep = count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
}
