import React from 'react'
import Customer from '../class/Customer'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';

class CustomersPage extends React.Component {
    state = {
        customers: null
    }

    componentDidMount() {
        Customer.getAll().then((data) => {
            this.setState({
                customers: data
            })
        })
    }

    render() {
        if (!this.state || !this.state.customers) {
            return <div>Loading ...</div>
        } else {
            let customers = this.state.customers
            return <div>
                <Grid container
                    direction="row"
                    alignItems="stretch"
                    spacing={16}>
                    <Grid item>
                        <Typography
                            component="h3"
                            variant="h5"
                        >Synced customers in local DB</Typography>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Display Name</TableCell>
                                        <TableCell align="right">Email</TableCell>
                                        <TableCell align="right">zoho ID</TableCell>
                                        <TableCell align="right">Booqable ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customers.map(customer => (
                                        <TableRow key={customer._id}>
                                            <TableCell component="th" scope="row">
                                                {customer.displayName}
                                            </TableCell>
                                            <TableCell align="right">{customer.email}</TableCell>
                                            <TableCell align="right">{customer.zohoID}</TableCell>
                                            <TableCell align="right">{customer.booqableID}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Typography
                            component="h3"
                            variant="h5"
                        >Sync Action</Typography>
                        <Grid container spacing={16} direction="row" alignItems="center">

                            <Grid item><Button variant="contained" color="primary" size="large">
                                <SyncIcon />
                                Sync
                            </Button></Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </div>
        }


    }
}

export default CustomersPage;