import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

interface State {
  selected: string
  all: string[]
}

interface Props extends WithStyles<typeof styles> {
  onSelection: (value: string) => void
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      flex: '1 0 auto',
      margin: theme.spacing.unit,
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
  })

class JobLevel extends React.Component<Props, State> {
  state: State = {
    selected: '',
    all: ['Internship', 'Entry Level', 'Mid Level', 'Senior Level'],
  }

  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value })
    const lookup = Number(e.target.value)
    this.props.onSelection(this.state.all[lookup])
  }

  render() {
    const { classes } = this.props

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="level">I am looking for a(n)</InputLabel>
          <Select
            value={this.state.selected}
            onChange={this.handleChange}
            inputProps={{
              name: 'selected',
              id: 'level',
            }}
          >
            {this.state.all.map((item, index) => (
              <MenuItem key={index} value={index}>
                {item} Position
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    )
  }
}

export default withStyles(styles)(JobLevel)
