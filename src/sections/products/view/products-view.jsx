import Axios from "axios";
import { useState,useEffect } from 'react';

import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// import DialogContentText from '@mui/material/DialogContentText';

// {import { users } from 'src/_mock/user';}

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from 'src/sections/user/table-no-data';
import UserTableRow from 'src/sections/user/user-table-row';
import UserTableHead from 'src/sections/user/user-table-head';
import TableEmptyRows from 'src/sections/user/table-empty-rows';
import UserTableToolbar from 'src/sections/user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';

// ----------------------------------------------------------------------

 export default function UserPage() {
   const [data, setData] = useState([]);
   const [openNew, setOpenNew] = useState(false);

  /*
   const [comment, setReview_comment_message] = useState();
   const [title, setReview_comment_title] = useState();
   const [score, setReview_score] = useState();
   */
  // const [orderId, setOrderId] = useState();

   // Add data
   const [post, setPost] = useState({
   orderId:'',
   score: '',
   title: '',
   comment:''

  });
   const handelInput = (event) => {
      setPost({ ...post, [event.target.name]: event.target.value });
   };

const handelSubmit = (event) => {
  event.preventDefault();
  console.log(post)
  Axios.post('http://localhost:8000/reviews/create', post)
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
};


// close window
     const handleClickCloseNew = () => {
           setOpenNew(false);
        };

 const handleClickOpenNew = () => {
         setOpenNew(true);
     };

    // get data
   const fetchData = async () => {
     try {
       const response = await Axios.get("http://localhost:8000/reviews");
      setData(response.data.Items);
    } catch (error) {
      console.log(error);
    }
   };
  
  useEffect(() => {
    fetchData();
  }, []);

// delete item
const handleDelete = (orderId,creationDate) => {

  Axios.post('http://localhost:8000/reviews/delete',{orderId,creationDate})
    .then((response) => {
      console.log(response);
      // Refresh the data after deletion
      fetchData();
    })
    .catch((error) => console.log(error));
};


// const handleClickSubmit = async () => {
//  try {
 // console.log(orderId);
  // console.log(comment);
   // const response = await Axios.post("http://localhost:8000/reviews/create", {
    //  orderId,
     // comment,
      // title,
    //  score
  //  });
  //  console.log(response.data);
    // Handle the response from the backend
 // } catch (error) {
  //  console.log(error);
    // Handle the error
 // }
// };
// till here
 // const handleClickSubmit = async () =>{

  //       await Axios.post ("http://localhost:8000/reviews",{orderId,comment,title,score })
   //      .then(response => console.log(response))
   //      .catch (error => console.log(error))


  //  };
//  const [data, setData]= useState([]);
  
//  const getData= async()=>{
//    const response= await Axios.get("http://localhost:8000/orders");
//      setData(response.data);
//
//   useEffect(()=>{ getData()},[]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
  });

 // const dataFiltered = applyFilter({
 //   inputData: users,
 //   comparator: getComparator(order, orderBy),
  //  filterName,
 // });

  const notFound = !dataFiltered.length && !!filterName;
/* new code 
  const items = data.Items;

  // Iterate over the 'Items' array
  items.forEach((item) => {
    const customerId = item.customer_id;
    const customerState = item.customer_state;
    const customerCity = item.customer_city;
    const customerZipCodePrefix = item.customer_zip_code_prefix;
    const customerUniqueId = item.customer_unique_id;
  
    // Do something with the customer data
    console.log(`Customer ID: ${customerId}`);
    console.log(`Customer State: ${customerState}`);
    console.log(`Customer City: ${customerCity}`);
    console.log(`Customer Zip Code Prefix: ${customerZipCodePrefix}`);
    console.log(`Customer Unique ID: ${customerUniqueId}`);
  }); */

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      
        <Typography variant="h4">Reviews </Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenNew}>
          Add Review
        </Button>
        
      </Stack>
   <div>
     <Dialog open={openNew} onClose={handleClickCloseNew} >
                         <DialogTitle><span style={{paddingRight:'10px'}}> </span>New Review</DialogTitle>
                         <DialogContent>

                         <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '40ch', backgroundColor:'#fff' }, paddingLeft:'0px', '& .MuiButton-root':{backgroundColor: '#0fa153'}}} noValidate autoComplete="off">
                             <div>
                                 <TextField id="Order_id" variant='outlined' label="Order Id" defaultValue="" name='orderId' onChange={handelInput} />
                             </div>

                             <div>
                                 <TextField id="review_comment_message" variant='outlined' label="Review Comment Message" defaultValue="" name="comment" onChange={handelInput} />
                             </div>
                             <div>
                                 <TextField id="review_comment_title" variant='outlined' label="Review Comment Title" type="string" defaultValue="" name='title' onChange={handelInput} />
                             </div>
                             <div>
                             <TextField id="review_score" variant='outlined' label="Review Score" type="string" defaultValue="" name='score' onChange={handelInput} />
                                </div>
                         </Box>
                         </DialogContent>
                         <DialogActions>
                             <Button onClick={handleClickCloseNew} style={{color:'#fff', backgroundColor:'#000000', border:'0.5px solid #004e38'}}>Cancel</Button>
                             <Button  onClick={handelSubmit} style={{color:'#fff', backgroundColor:'#000000', border:'0.5px solid #004e38'}}>Submit</Button>
                         </DialogActions>
                     </Dialog>
               </div>
      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
         
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                
                rowCount={dataFiltered.length} // {rowCount={users.length}}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                 // { id: 'customer_id', label: 'Customer id' },
                  { id: 'order_id', label: 'Order id' },
                  { id: "review_creation_date", label: 'Review creation date' },
                  { id: 'review_answer_timestamp', label: 'Review answer timestamp' },
                  { id: 'review_comment_message', label: 'Review message' },
                  { id: 'review_comment_title', label: 'Review comment title' },
                  { id: 'review_id', label: 'Review id' },
                  { id: 'review_score', label: 'Review score' },

                  
                  { id: '' },
                ]}
              />
              <TableBody>
              
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                     // key={row.order_id}
                      name={row.order_id} // review_creation_date
                      company={row.review_creation_date}
                      role={row.review_answer_timestamp}

                    //  company={row.customer_zip_code_prefix}
                     // avatarUrl={row.avatarUrl}
                    //   isVerified={row.isVerified}
                       isVerified={row.review_comment_message}
                       Title ={row.review_comment_title}
                       reviewId= {row.review_id}
                     //  company={row.review_id}
                        status={row.review_score}

                     // onDelete={() => { setOrderId(row.order_id); handleDelete(row.order_id); } } // i added this for delete
                       onDelete={() => handleDelete(row.order_id,row.review_creation_date) }
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  )) }

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, data.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
