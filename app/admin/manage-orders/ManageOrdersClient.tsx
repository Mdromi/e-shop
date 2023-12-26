"use client";

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Status from "@/app/components/Status";
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import moment from "moment";
import Heading from "@/app/components/products/Heading";

interface ManageOrdersClientProps {
  orders: ExtendedOrder[];
}

interface PaymentStatusProps {
  paymentStatus: "pending" | "succeeded";
}

interface DeliveryStatusProps {
  deliveryStatus: "pending" | "dispatched" | "delivered";
}

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrdersClient: React.FC<ManageOrdersClientProps> = ({ orders }) => {
  const router = useRouter();
  let rows: any = [];

  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount / 100),
        paymentStatus: order.status,
        date: moment(order.createdDate).fromNow(),
        deliveryStatus: order.deliveryStatus,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "customer", headerName: "Customer Name", width: 130 },
    {
      field: "amount",
      headerName: "Amount(USD)",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.amount}</div>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 120,
      renderCell: (params) => {
        return <PaymentStatus paymentStatus={params.row.paymentStatus} />;
      },
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 120,
      renderCell: (params) => {
        return <DeliveryStatus deliveryStatus={params.row.deliveryStatus} />;
      },
    },
    {
      field: "date",
      headerName: "Name",
      width: 130,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdDeliveryDining}
              onClick={() => {
                handleDispatch(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdDone}
              onClick={() => {
                handleDeliver(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`/order/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleDispatch = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "dispatched",
      })
      .then((res) => {
        toast.success("Order Dispatched");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Opps! Something went wrong");
        console.log(err);
      });
  }, []);

  const handleDeliver = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "delivered",
      })
      .then((res) => {
        toast.success("Order Delivierd");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Opps! Something went wrong");
        console.log(err);
      });
  }, []);

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage orders" center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

const PaymentStatus: React.FC<PaymentStatusProps> = ({ paymentStatus }) => {
  return (
    <div>
      {paymentStatus === "pending" ? (
        <Status
          text="pending"
          icon={MdAccessTimeFilled}
          bg="bg-slate-200"
          color="text-slate-700"
        />
      ) : paymentStatus === "succeeded" ? (
        <Status
          text="succeeded"
          icon={MdDeliveryDining}
          bg="bg-green-200"
          color="text-green-700"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

const DeliveryStatus: React.FC<DeliveryStatusProps> = ({ deliveryStatus }) => {
  return (
    <div>
      {deliveryStatus === "pending" ? (
        <Status
          text="pending"
          icon={MdAccessTimeFilled}
          bg="bg-slate-200"
          color="text-slate-700"
        />
      ) : deliveryStatus === "dispatched" ? (
        <Status
          text="dispatched"
          icon={MdDeliveryDining}
          bg="bg-purple-200"
          color="text-purple-700"
        />
      ) : deliveryStatus === "delivered" ? (
        <Status
          text="delivered"
          icon={MdDone}
          bg="bg-green-200"
          color="text-green-700"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ManageOrdersClient;
