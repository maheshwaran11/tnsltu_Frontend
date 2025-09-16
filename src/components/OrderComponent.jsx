import React, { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Button, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem,
  Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Chip,
  IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from "../store";
import { createOrderAPI, getOrdersByUserAPI, deleteOrderAPI } from "../api";

const products = [
  { id: 1, name: "Notice" },
  { id: 2, name: "Banner" },
  { id: 3, name: "Bill Book" },
  { id: 4, name: "Member Book" },
  { id: 5, name: "Visiting Card" }
];

function OrderComponent() {
  const { profile, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  // ✅ Products already ordered
  const orderedProducts = [...new Set(orders.map((o) => o.product_name))];

  const getAllOrdersAPI = async () => {
    if (!profile?.id) return;
    const res = await getOrdersByUserAPI(profile.id, token);
    if ([200, 201].includes(res.status)) {
      setOrders(res.data);
    }
  };

  // 🔹 Fetch my orders on mount
  useEffect(() => {
    getAllOrdersAPI();
  }, [profile, token]);

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity || quantity <= 0) {
      alert("Please select a product and enter valid quantity");
      return;
    }

    setLoading(true);
    try {
      const product = products.find((p) => p.id === selectedProduct);

      const result = await createOrderAPI(
        {
          user_id: profile.id,
          product_name: product.name,
          quantity: Number(quantity),
        },
        token
      );

      if ([200, 201].includes(result.status)) {
        alert("Order placed successfully");
        getAllOrdersAPI();
        setOpen(false);
        setSelectedProduct("");
        setQuantity("");
      } else {
        alert(result.message || "Failed to create order");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    setLoading(true);
    try {
      const result = await deleteOrderAPI(orderId, token);
      if ([200, 201].includes(result.status)) {
        alert("Order deleted successfully");
        getAllOrdersAPI();
      } else {
        alert(result.message || "Failed to delete order");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Card>
          <CardContent>
            <Grid container justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">My Orders</Typography>
              <Button variant="contained" onClick={() => setOpen(true)}>
                New Order
              </Button>
            </Grid>

            {orders.length === 0 ? (
              <Typography>No orders yet.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Requested Qty</TableCell>
                      <TableCell>Approved Qty</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((row) => (
                      <TableRow key={row.detail_id}>
                        <TableCell>{row.order_id}</TableCell>
                        <TableCell>{row.product_name}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>{row.approved_quantity ?? "-"}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.order_status}
                            color={
                              row.order_status === "approved"
                                ? "success"
                                : row.order_status === "rejected"
                                ? "error"
                                : "warning"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {/* <IconButton onClick={() => handleEditOrder(row)}>
                            <EditIcon />
                          </IconButton> */}
                          <IconButton onClick={() => handleDeleteOrder(row.order_id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

      {/* New Order Popup */}
      <Dialog open={open} onClose={() => setOpen(false)} >
        <DialogTitle>Place New Order</DialogTitle>
        <DialogContent style={{ minWidth: 400 }}>
          <TextField
            select
            label="Select Product"
            fullWidth
            margin="dense"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(Number(e.target.value))}
          >
            {products.map((p) => (
              <MenuItem
                key={p.id}
                value={p.id}
                disabled={orderedProducts.includes(p.name)} // ✅ disable if already ordered
              >
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Quantity"
            fullWidth
            margin="dense"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Place Order"}
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
}

export default OrderComponent;
