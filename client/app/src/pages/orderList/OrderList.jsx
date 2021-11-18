import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { Box, withStyles } from "@material-ui/core";

import { DeleteOutline } from "@material-ui/icons";
import { productRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios"

export default function ProductList() {
  const [orders, setOrder] = useState([]);

  const StyledDataGrid = withStyles({
    root: {
      "& .MuiDataGrid-renderingZone": {
        maxHeight: "none !important"
      },
      "& .MuiDataGrid-cell": {
        lineHeight: "unset !important",
        maxHeight: "none !important",
        whiteSpace: "normal"
      },
      "& .MuiDataGrid-row": {
        maxHeight: "none !important"
      }
    }
  })(DataGrid);

  useEffect( () => {

    const fetchData = async () => {
      const result = await axios(
        "https://glitchhub.coffee/api/v1/orders",
      );

      setOrder(result.data);
    };
    fetchData();

  },[]);


  const [data, setData] = useState(productRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "customerName",
      headerName: "Customer",
      width: 100,
    },
    {
      field: "date",
      headerName: "Date",
      width: 100,
    },
    {
      field: "products",
      headerName: "Products",
      width: 800,
      renderCell: (params) => {
        return (
          <div className="productListItem">


            {params.row.products.map(product => (
              <div className="products"> <p><b>{product.name}</b> </p> <p><b>QTY:</b> {product.amount}</p></div>
          ))}
      
          </div>
        );
      },
    }

  ];

  return (
    
    <div className="productList">

      {/* <ul>
        {orders.map(order => (
          <li key={order.id}>
            <p>{order.id}, {order.date}</p>
          </li>
        ))}
      </ul> */}
      <Box height={"100%"}>
        <StyledDataGrid
          rows={orders}
          disableSelectionOnClick
          columns={columns}
          pageSize={20}
          checkboxSelection
        />
      </Box>

    </div>
  );
}
