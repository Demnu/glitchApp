// in src/users.js
import * as React from "react";
import { List, Datagrid, TextField, EmailField } from 'react-admin';

 const OrderList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="customerName" />
            <TextField source="date" />
            <TextField source="products" />
        </Datagrid>
    </List>
);
export default OrderList