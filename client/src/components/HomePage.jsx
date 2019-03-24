import React from 'react'
import { Grid } from '@material-ui/core'
import Log from '../class/Logs'

class HomePage extends React.Component {
    state = {
        logs: null
    }

    componentDidMount() {
        Log.getAll().then((data) => {
            this.setState({
                logs: data
            })
        })
    }


    render() {
        if (!this.state || !this.state.logs) {
            return <div>Loading ...</div>
        } else {
            let logs = this.state.logs
            return <Grid container>
                <Grid item md={12}></Grid>
                <Grid item md={12} className="ConsoleLog">
                    {logs.map(log => (
                        <p key={log._id}>{log.message}</p>
                    ))}
                </Grid>
            </Grid>
        }
    }
}

export default HomePage