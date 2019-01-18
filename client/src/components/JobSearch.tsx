import React from 'react'
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core'
import {
  Suggestion,
  getSuggestionValue,
  getSuggestions,
  renderInputComponent,
  renderSuggestion,
} from './AutoSuggestProps'
import Paper from '@material-ui/core/Paper'
import Autosuggest, { ChangeEvent, SuggestionsFetchRequestedParams } from 'react-autosuggest'

interface State {
  value: string
  selectedItem: Suggestion | null
  suggestions: Suggestion[]
}

interface Props extends WithStyles<typeof styles> {
  allSuggestions: Suggestion[]
  onSelection: (value: string | null) => void
  label: string
  placeholder: string
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      flex: '1 0 auto',
      position: 'relative',
      margin: theme.spacing.unit,
    },
    suggestionsContainerOpen: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    },
    suggestion: {
      display: 'block',
    },
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },
    divider: {
      height: theme.spacing.unit * 2,
    },
  })

class JobSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: '',
      selectedItem: null,
      suggestions: [],
    }
  }

  handleSuggestionsFetchRequested = ({ value }: SuggestionsFetchRequestedParams) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.allSuggestions),
    })
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  handleChange = (event: any, { newValue }: ChangeEvent) => {
    const prevItem = this.state.selectedItem
    const selectedItem = this.props.allSuggestions.find(item => item.label === newValue) || null

    this.setState({
      value: newValue,
      selectedItem,
    })

    if (prevItem !== selectedItem) {
      this.props.onSelection(selectedItem ? selectedItem.label : null)
    }
  }

  handleBlur = () => {
    if (this.state.selectedItem) {
      return
    }

    this.setState({
      value: '',
    })
  }

  render() {
    const { classes, label, placeholder } = this.props
    const autosuggestProps = {
      renderInputComponent,
      getSuggestionValue,
      renderSuggestion,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
    }

    return (
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          label,
          classes,
          placeholder,
          value: this.state.value,
          onChange: this.handleChange,
          onBlur: this.handleBlur,
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square={true}>
            {options.children}
          </Paper>
        )}
      />
    )
  }
}

export default withStyles(styles)(JobSearch)
