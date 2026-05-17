const Order = require("../Model/Order");

const addOrderStatus = async (orderId, status) => {
  try {
    await Order.findByIdAndUpdate(orderId, {
      $push: {
        statusHistory: {
          status,
          time: new Date(),
        },
      },
      orderStatus: status,
    });
  } catch (err) {
    console.log("Status update error:", err.message);
  }
};

module.exports = addOrderStatus;