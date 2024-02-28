import { useEffect, useState } from 'react';
import '../App.css';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';

function Home() {
    const [cars, setCars] = useState([])
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [model, setModel] = useState("")
    const [quantity, setQuantity] = useState(0)

    const [errorMsg, setErrorMsg] = useState("")

    const [open, setOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null)
    const [toast, setToast] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
      });
    
    const { vertical, horizontal } = toast;

    const [showNotif, setShowNotif] = useState(false)
    const [notifMsg, setNotifMsg] = useState("")

    useEffect(() => {
        const fetchCars = async () => {
            await axios.post("https://carrentapi-carrent.up.railway.app/api/v1/car/all")
                .then(_res =>{
                    console.log(_res)
                    setCars(prev => _res.data.data)
                })
                .catch(_err => {
                    setNotifMsg("Something went wrong")
                })
        }
        fetchCars()
    },[])

    const handleClickOpen = (row) => {
        setOpen(true);
        setSelectedCar(row)
        setEmail(prev=> row.user)
        setName(prev=> row.name)
        setModel(prev => row.model)
        setQuantity(prev=> row.quantity)
    };
    
      const handleClose = () => {
        setOpen(false);
      };


    
      
    const handleCreate = async () => {
        if(validateInputs(email) || validateInputs(name) || validateInputs(quantity)){
            setErrorMsg(prev => "Invalid Input")
            return false
        }

        await axios.post("https://carrentapi-carrent.up.railway.app/api/v1/car/create",{name, user: email,model, quantity})
        .then(_res =>{
            setNotifMsg(prev => "User Create")
            setCars(prev => [...prev, _res.data.data])
        })
        .catch(_err => {
            setNotifMsg("Something went wrong")
        })
        setShowNotif(prev => true)
        
    }

    const handleUpdate = async () => {

        if(validateInputs(email) || validateInputs(name) || validateInputs(model) || validateInputs(quantity)){
            setErrorMsg(prev => "Invalid Input")
            return false
        }

        await axios.post("http://localhost:3001/api/v1/car/update",{id:selectedCar._id, name, user: email,model, quantity})
            .then(_res =>{
                console.log("update >>", _res.data.data._id)
                let carList = cars
                carList.map((_car,idx) => {
                    console.log("DAA >> ", _car._id == _res.data.data._id)
                    if(_car._id == _res.data.data._id){
                        carList[idx] = _res.data.data
                    }
                })
                console.log("updated list >> ", carList)
                setCars(prev=> carList)
                setNotifMsg(prev => "Car Updated")
            })
            .catch(_err => {
                setNotifMsg("Something went wrong")
            })
        setShowNotif(prev => true)
        setEmail(prev=> "")
        setName(prev=> "")
        setModel(prev => "")
        setQuantity(prev=> "")
        setOpen(false);
    }


    const validateInputs = (str) => {
        return (!str || str.length === 0 );
    }

    const renderTable = () => {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Model</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {cars.length > 0 && cars.map((row,index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell align="right">{row?.name}</TableCell>
                        <TableCell align="right">{row?.model}</TableCell>
                        <TableCell align="right">{row?.quantity}</TableCell>
                        <TableCell align="right">
                            <Button variant="contained" href="#contained-buttons" className='flex justify-end' onClick={() => handleClickOpen(row)}>Update</Button>
                        </TableCell>

                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const renderCreateUI = (type='CREATE') => {
        return(
            <>
                <TextField name="email" placeholder='Please Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} id="outlined-basic" label="Email" variant="outlined" />

                <div className='flex flex-col m-4 gap-4'>
                    <TextField name="car_name" placeholder='Car name...' value={name} onChange={(e) => setName(e.target.value)} id="outlined-basic" label="Car name" variant="outlined" />
                    <TextField name="model" placeholder='Model' value={model} onChange={(e) => setModel(e.target.value)} id="outlined-basic" label="Model" variant="outlined" />
                    <TextField name="quantity" placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} id="outlined-basic" label="Quantity" variant="outlined" />
                </div>{
                    type == 'CREATE' ?
                    <Button variant="contained" href="#contained-buttons" className='flex justify-end' onClick={handleCreate}>Create</Button>
                    : <></>
                }
            </>
        )
    }

  return (
    <div className='flex flex-1 flex-col justify-center items-center'>
            <div className='gap-4'>
                    {!open ? renderCreateUI() : <></>}
            </div>
            <div className='mt-16'>
                {renderTable()}
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">

                <DialogTitle id="alert-dialog-title">
                {"Update Car"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {renderCreateUI('UPDATE')}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpdate} autoFocus>
                    Update
                </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={showNotif}
            autoHideDuration={5000}
            message={notifMsg}
            key={vertical + horizontal}
        />
    </div>
  );
}

export default Home;
