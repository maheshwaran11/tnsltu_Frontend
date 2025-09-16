import React, { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, Button, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, TextField, Box
} from "@mui/material";
import { getAllOrdersAPI, updateOrderStatusAPI } from "../api";
import { useAuth } from "../store";

function AdminOrderList() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null);
  const [approvedQty, setApprovedQty] = useState("");

  const fetchOrders = async () => {
    const res = await getAllOrdersAPI(token);
    if ([200, 201].includes(res.status)) {
      setOrders(res.data);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const startEditing = (order) => {
    setEditing(order.detail_id); // each row unique by detail_id
    setApprovedQty(order.approved_quantity ?? order.quantity ?? "");
  };

  const handleApprove = async (order) => {
    console.log("Approving order:", order);
    const payload = {
      order_id: order.order_id,
      detail_id: order.detail_id,              // ✅ using detail_id
      approved_quantity: Number(approvedQty),
      status: "approved",
    };

    const res = await updateOrderStatusAPI(payload, token);
    if (res.status === 200) {
      fetchOrders();
      setEditing(null);
    }
  };

  const handleReject = async (order) => {
    const payload = {
      order_id: order.order_id,
      detail_id: order.detail_id,              // ✅ using detail_id
      approved_quantity: 0,
      status: "rejected",
    };

    const res = await updateOrderStatusAPI(payload, token);
    if (res.status === 200) {
      fetchOrders();
      setEditing(null);
    }
  };

  return (
        <Card>
          <CardContent>
            <Typography variant="h6">All Orders</Typography>

            {orders.length === 0 ? (
              <Typography>No orders found</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Requested Qty</TableCell>
                      <TableCell>Approved Qty</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.detail_id}>
                        <TableCell>{order.order_id}</TableCell>
                        <TableCell>{order.username || `User ${order.user_id}`}</TableCell>
                        <TableCell>{order.product_name}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>
                          {editing === order.detail_id ? (
                            <TextField
                              type="number"
                              size="small"
                              value={approvedQty}
                              onChange={(e) => setApprovedQty(e.target.value)}
                            />
                          ) : (
                            order.approved_quantity ?? "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.order_status}
                            color={
                              order.order_status === "approved"
                                ? "success"
                                : order.order_status === "rejected"
                                ? "error"
                                : "warning"
                            }
                          />
                        </TableCell>
                        <TableCell>
                            <>
                              {editing === order.detail_id ? (
                                <Box display="flex" gap={1}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleApprove(order)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleReject(order)}
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    variant="text"
                                    onClick={() => setEditing(null)}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="info"
                                  onClick={() => startEditing(order)}
                                >
                                  Review
                                </Button>
                              )}
                            </>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
  );
}

export default AdminOrderList;
