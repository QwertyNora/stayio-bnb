import React, { useEffect, useState } from "react";
import { Button, DatePicker, Space } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Modal from "antd/es/modal/Modal";
import { getDateRange, stripTimezone } from "@/utils/dates";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker> & {
  bookedDates: Date[];
  listingId: string;
  dailyRate: number;
  actionMode: "create" | "update";
  bookingId?: string;
  initialDates?: [Date, Date];
  onConfirm: (dates: [Date, Date], totalPrice: number) => void;
};

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

export const DateRangePicker = (props: RangePickerProps) => {
  const [range, setRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    null,
    null,
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (props.initialDates) {
      setRange([dayjs(props.initialDates[0]), dayjs(props.initialDates[1])]);
    }
  }, [props.initialDates]);

  useEffect(() => {
    if (range[0] && range[1]) {
      const daysBooked = range[1].diff(range[0], "day") + 1;
      setTotalPrice(daysBooked * props.dailyRate);
    } else {
      setTotalPrice(0);
    }
  }, [range, props.dailyRate]);

  const handleConfirm = () => {
    if (range[0] && range[1]) {
      const checkInDate = range[0].toDate();
      const checkOutDate = range[1].toDate();

      props.onConfirm([checkInDate, checkOutDate], totalPrice);
    }
    setIsModalVisible(false);
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    if (!props.bookedDates || !Array.isArray(props.bookedDates)) {
      return false;
    }

    const isBooked = props.bookedDates.some((date) => {
      const bookedDate = dayjs(date);
      return (
        bookedDate.isSame(current, "day") &&
        !(
          props.actionMode === "update" &&
          props.initialDates &&
          (bookedDate.isSame(dayjs(props.initialDates[0]), "day") ||
            bookedDate.isSame(dayjs(props.initialDates[1]), "day") ||
            (bookedDate.isAfter(dayjs(props.initialDates[0])) &&
              bookedDate.isBefore(dayjs(props.initialDates[1]))))
        )
      );
    });
    return current && (current < dayjs().startOf("day") || isBooked);
  };

  return (
    <>
      <Space direction="vertical" size={12}>
        <RangePicker
          disabledDate={disabledDate}
          value={range}
          onChange={(dates) => setRange(dates || [null, null])}
        />
      </Space>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        disabled={!range[0] || !range[1]}
        className="ml-2"
      >
        {props.actionMode === "create" ? "Book Now" : "Update Booking"}
      </Button>
      <Modal
        title={
          props.actionMode === "create" ? "Confirm Booking" : "Confirm Update"
        }
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Check-In: {range[0] ? range[0].format("YYYY-MM-DD") : ""}</p>
        <p>Check-Out: {range[1] ? range[1].format("YYYY-MM-DD") : ""}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
        <p>
          Do you want to{" "}
          {props.actionMode === "create"
            ? "confirm this booking"
            : "confirm this update"}
          ?
        </p>
      </Modal>
    </>
  );
};
