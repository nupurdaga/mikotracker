import React from 'react';
import logo from './miko-logo.png';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { encode } from "base-64";


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
}));


function createData(orderid, ordername, date, address, number, amount, track) {
  return { orderid, ordername, date, address, number, amount, track };
}

const rows = [
  createData('12368', 'The Miko 2 Robot - Martian Red', 'Nupur Daga', '24/01/2020', 'a44block1build', 8019068025, 25000, "Track your order"),
];


const ENDPOINT = 'http://13.233.38.65/search/?';

const options = {
  method: 'GET',
  mode: 'cors',
  headers: {
      'Content-Type': 'application/json',
      "Accept": 'application/json',
      "Access-Control-Allow-Origin": "*"
  }
}

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState('id');
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [ordersData, setOrdersData] = React.useState([]);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const onInputChange = e => {
    setInput(e.target.value);
  }

  const setCorrectData = (finalResponse) => {
    if(finalResponse.data) {
      setOrdersData(finalResponse.data);
    }
    setLoading(false);
  }

  const onBtnClick = e => {
    if(!loading) {
      setLoading(true);
      fetch(`${ENDPOINT}type=${value}&value=${input}`, options)
          .then(response => response.json())
          .then(finalResponse => setCorrectData(finalResponse))
          .catch(error => setLoading(false));
    }
  }

  const getAddress = (addressData) => {
    let str = addressData.first_name +" "+ addressData.last_name + ', ';
    str += addressData.address1 + ', ';
    str += addressData.address2 + ', ';
    str += addressData.city + ', ';
    str += addressData.country + ', ';
    if(addressData.phone)
      str += addressData.phone + " ";
    if(addressData.zip)
      str += addressData.zip;

    return str;
  }

  const getProducts = (lineItems) => {
    let nodes = lineItems.map(lineItem => {
      return lineItem.name;
    });
    return nodes.join(", ");
  }

  const getDate = (date) => {
    var today = new Date(date);
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    } 
    return dd + '/' + mm + '/' + yyyy;
  }

  const table_row = ordersData.map((row) =>
    <TableRow key={row.name}>
        <TableCell component="th" scope="row" colSpan={1}>
          #{row.order_number}
        </TableCell>
        <TableCell align="left" colSpan={2} style={{width: '400px'}}>{getProducts(row.line_items)}</TableCell>
        <TableCell align="left" colSpan={1}>{getDate(row.processed_at)}</TableCell>
        <TableCell align="left" colSpan={3} style={{width: '400px'}}>{getAddress(row.shipping_address)}</TableCell>
        <TableCell align="left" colSpan={3} style={{width: '400px'}}>{getAddress(row.billing_address)}</TableCell>
        <TableCell align="left" colSpan={1} style={{width: '120px'}}>{row.shipping_address.phone}<br />{row.email}</TableCell>
        <TableCell align="left" colSpan={1}>{row.total_discounts}</TableCell>
        <TableCell align="left" colSpan={1}>{row.total_price}</TableCell>
        <TableCell align="left" colSpan={1}><a href={row.order_status_url} target="_blank">Track</a></TableCell>
    </TableRow>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <a href="https://miko.ai/">
              <img src={logo} className="logo" alt="logo" />
            </a>
          </IconButton>
          <Typography variant="h6" className={classes.title}>

          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <div className="main_wrap">
        <div>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend"> Please choose any one option </FormLabel>
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
              <FormControlLabel value="id" control={<Radio />} label="Order Id" />
              <FormControlLabel value="first_name" control={<Radio />} label="Customer Name" />
              <FormControlLabel value="email" control={<Radio />} label="Customer Email" />
              <FormControlLabel value="phone" control={<Radio />} label="Customer Phone Number" />
            </RadioGroup>
          </FormControl>
        </div>
        <form className="input_wrap" noValidate autoComplete="off">
          <TextField
          id="outlined-full-width"
          label="Order / Customer info"
          style={{ margin: 8 }}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={input}
          onChange={onInputChange}
        />
        </form>
        <div className="button_wrap">
          <Button variant="contained" color="primary" disabled={loading} onClick={onBtnClick}>
            Search
          </Button>
        </div>
        <div className="table_wrap">
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={1}>Order</TableCell>
                    <TableCell colSpan={2}>Products</TableCell>
                    <TableCell align="left" colSpan={1}>Date</TableCell>
                    <TableCell align="left" colSpan={3}>Shipping Address</TableCell>
                    <TableCell align="left" colSpan={3}>Billing Address</TableCell>
                    <TableCell align="left" colSpan={1}>Info</TableCell>
                    <TableCell align="left" colSpan={1}>Discounts</TableCell>
                    <TableCell align="left" colSpan={1}>Price</TableCell>
                    <TableCell align="left" colSpan={1}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {table_row}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
  );
}

export default App;
