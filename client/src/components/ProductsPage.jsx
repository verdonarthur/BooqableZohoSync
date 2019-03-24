import React from 'react'
import Product from '../class/Product'

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

class ProductsPage extends React.Component {
    state = {
        items: null
    }

    componentDidMount() {
        Product.getAll().then((data) => {
            this.setState({
                items: data
            })
        })
    }

    render() {
        if (!this.state || !this.state.items) {
            return <div>Loading ...</div>
        } else {
            let items = this.state.items
            return <div>
                <Grid container
                    direction="row"
                    alignItems="stretch"
                    spacing={16}>
                    <Grid item>
                        <Typography
                            component="h3"
                            variant="h5"
                        >Synced products in local DB</Typography>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Price (CHF)</TableCell>
                                        <TableCell align="right">SKU</TableCell>
                                        <TableCell align="right">zoho ID</TableCell>
                                        <TableCell align="right">Booqable ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map(item => (
                                        <TableRow key={item._id}>
                                            <TableCell component="th" scope="row">
                                                {item.name}
                                            </TableCell>
                                            <TableCell align="right">{item.priceInCents/100}</TableCell>
                                            <TableCell align="right">{item.sku}</TableCell>
                                            <TableCell align="right">{item.zohoID}</TableCell>
                                            <TableCell align="right">{item.booqableID}</TableCell>
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

export default ProductsPage;