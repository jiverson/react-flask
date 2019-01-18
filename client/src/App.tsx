import React from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import queryString from 'query-string'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import withRoot from './withRoot'
import JobLevel from './components/JobLevel'
import { Suggestion } from './components/AutoSuggestProps'
import JobSearch from './components/JobSearch'

interface State {
  value: string
  jobListings: any[]
  industries: Suggestion[]
  locations: Suggestion[]
  category: string | null
  location: string | null
  level: string | null
  loading: boolean
  firstRun: boolean
}

interface Props extends WithStyles<typeof styles> {}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.grey['200'],
    },
    paper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      minWidth: 800,
      padding: theme.spacing.unit * 3,
    },
    results: {
      position: 'relative',
      marginTop: theme.spacing.unit * 3,
      alignItems: 'center',
      width: 800,
      padding: theme.spacing.unit * 3,
    },
    divider: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
    ul: {
      width: '100%',
      maxWidth: 800,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 300,
    },
    blocker: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    progress: {},
    deleteIcon: {
      position: 'absolute',
      top: theme.spacing.unit,
      right: theme.spacing.unit,
    },
  })

async function callApi(): Promise<any> {
  const response = await fetch('/load')
  const body = await response.json()
  if (response.status !== 200) {
    throw Error(body.message)
  }
  return body
}

async function jobsApi(params: any): Promise<any> {
  const response = await fetch(`/jobs?${queryString.stringify(params)}`)
  const body = await response.json()
  if (response.status !== 200) {
    throw Error(body.message)
  }
  return body
}

const defaultState: State = {
  jobListings: [],
  value: '',
  category: null,
  location: null,
  level: null,
  industries: [],
  locations: [],
  loading: true,
  firstRun: true,
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.handleLevelChange = this.handleLevelChange.bind(this)
    this.handleDeleteCache = this.handleDeleteCache.bind(this)
    this.getJobs = this.getJobs.bind(this)
    this.state = defaultState
  }

  getJobs() {
    const { location, level, category } = this.state
    const params: any = {}
    if (location) {
      params.location = location
    }
    if (level) {
      params.level = level
    }
    if (category) {
      params.category = category
    }

    jobsApi({ ...params, page: 1 })
      .then(res => {
        if (res) {
          this.setState({
            firstRun: false,
            jobListings: res.results,
          })
        }
      })
      .catch(err => console.log(err))
  }

  handleCategoryChange(value: string | null) {
    this.setState({ category: value })
  }

  handleLocationChange(value: string | null) {
    this.setState({ location: value })
  }

  handleLevelChange(value: string | null) {
    this.setState({ level: value })
  }

  handleDeleteCache() {
    localStorage.clear()
    this.setState(defaultState)
    this.init()
  }

  handleListItemClick = (event: any, index: any) => {
    // console.log('App::handleListItemClick') // DEBUG
  }

  componentDidMount() {
    this.init()
  }

  init() {
    this.setState({ loading: true })
    const company = localStorage.getItem('company')
    if (company) {
      this.setupState(JSON.parse(company))
      return
    }

    callApi()
      .then(res => {
        localStorage.setItem('company', JSON.stringify(res))
        this.setupState(res)
      })
      .catch(err => console.log(err))
  }

  setupState(company: any) {
    this.setState({
      loading: false,
      industries: company.company_industries.map((c: string) => ({ label: c })),
      locations: company.company_locations.map((c: string) => ({ label: c })),
    })
  }

  render() {
    const { classes } = this.props
    const { jobListings, loading, industries, locations, firstRun } = this.state
    const showResult = jobListings.length > 0

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <JobLevel onSelection={this.handleLevelChange} />
          <JobSearch
            label={'In the field of'}
            placeholder={'Category'}
            allSuggestions={industries}
            onSelection={this.handleCategoryChange}
          />
          <JobSearch
            label={'Near'}
            placeholder={'Location'}
            allSuggestions={locations}
            onSelection={this.handleLocationChange}
          />
          <Button onClick={this.getJobs} variant="contained" size="large" color="primary" disabled={loading}>
            Search
          </Button>
          {loading && (
            <div className={classes.blocker}>
              <CircularProgress className={classes.progress} />
            </div>
          )}
        </Paper>
        {showResult && (
          <Paper className={classes.results}>
            <Typography variant="h4" gutterBottom>
              Job Results:
            </Typography>
            <Tooltip title="Clear localstorage">
              <IconButton className={classes.deleteIcon} onClick={this.handleDeleteCache} aria-label="Delete">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Divider className={classes.divider} />
            <List className={classes.ul}>
              {jobListings.map(item => (
                <ListItem key={`item-${item.id}`} button onClick={event => this.handleListItemClick(event, item.id)}>
                  <ListItemText primary={`${item.company.name}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        {!showResult && !firstRun && (
          <Paper className={classes.results}>
            <Typography variant="h4" gutterBottom>
              No Results Found
            </Typography>
          </Paper>
        )}
      </div>
    )
  }
}

export default withRoot(withStyles(styles, { withTheme: true })(App))
