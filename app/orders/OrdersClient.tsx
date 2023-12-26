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
import { useRouter } from "next/navigation";
import moment from "moment";
import Heading from "@/app/components/products/Heading";

interface OrdersClientProps {
  orders: ExtendedOrder[];
}

interface PaymentStatusProps {
  paymentStatus: "pending" | "complete";
}

interface DeliveryStatusProps {
  deliveryStatus: "pending" | "dispatched" | "delivered";
}

type ExtendedOrder = Order & {
  user: User;
};

const OrdersClient: React.FC<OrdersClientProps> = ({ orders }) => {
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
  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title=" orders" center />
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
      ) : paymentStatus === "complete" ? (
        <Status
          text="complete"
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

export default OrdersClient;
