import prisma from "@/libs/prismadb";
import moment from "moment";

export default async function getGraphData() {
  try {
    // Get the start and dates for the data range(7 days ago to today)
    const startDate = moment().subtract(6, "days").startOf("day");
    const endDate = moment().endOf("day");

    // Query the database to get order data grouped by cratedDate
    const result = await prisma.order.groupBy({
      by: ["createdDate"],
      where: {
        createdDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        status: "complete",
      },
      _sum: {
        amount: true,
      },
    });

    // Initialize an object aggregate the data by day
    const aggregatedData: {
      [day: string]: { day: string; date: string; totalAmount: number };
    } = {};

    // Create a clone of the start date to iterate over each day
    const currentDate = startDate.clone();

    // Iterate over each day in the date range
    while (currentDate <= endDate) {
      // Formate the day as a string(e,g.., "Monday")
      const day = currentDate.format("dddd");

      // Initialize the aggregated data for the day with the day, date, end totalAmount

      aggregatedData[day] = {
        day,
        date: currentDate.format("YYYY-MM-DD"),
        totalAmount: 0,
      };

      // Move the next day
      currentDate.add(1, "day");
    }

    //  Calculate the total for each day by summing the orders amount
    result.forEach((entry) => {
      const day = moment(entry.createdDate).format("dddd");
      const ammount = entry._sum.amount || 0;
      aggregatedData[day].totalAmount += ammount;
    });

    // Convert the aggrgatedData object to an array and sort it by date
    const formatedData = Object.values(aggregatedData).sort((a, b) =>
      moment(a.date).diff(moment(b.date))
    );

    // Return the formated data
    return formatedData;
  } catch (error: any) {
    throw new Error(error);
  }
}
