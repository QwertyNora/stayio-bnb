"use client";

import React, { useEffect, useState } from "react";
import { Button, DatePicker, Space } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useUser } from "@/context/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "antd/es/modal/Modal";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker> & {
  bookedDates: Date[];
  listingId: string; // Ta emot listnings-ID
  dailyRate: number; // Dagligt pris för listningen
};

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const DateRangePicker = (props: RangePickerProps) => {
  const [range, setRange] = React.useState<typeof props.value>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { token, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("Token changed:", token);
    setRange(null);
  }, [token]);

  useEffect(() => {
    if (range && props.dailyRate) {
      const [from, to] = range;
      if (from && to) {
        const isBooked = props.bookedDates.some(
          (date) => dayjs(date).isAfter(from) && dayjs(date).isBefore(to)
        );
        if (isBooked) {
          setRange(null);
        }
        // Beräkna totalpris, säkerställ att `from` och `to` är giltiga
        const daysBooked = dayjs(to).diff(dayjs(from), "day") + 1;
        setTotalPrice(daysBooked * props.dailyRate);
      }
    } else {
      setTotalPrice(0); // Om något saknas, sätt totalpris till 0
    }
  }, [props.bookedDates, range, props.dailyRate]);

  const handleBookNow = () => {
    setIsModalVisible(true); // Visa modal för bekräftelse
  };

  const handleConfirmBooking = async () => {
    // Här skickar vi bokningsförfrågan till backend
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Skicka JWT-tokenen i Authorization-headern
        },
        body: JSON.stringify({
          listingId: props?.listingId,
          checkInDate: range ? range[0] : null,
          checkOutDate: range ? range[1] : null,
          totalPrice,
          createdById: user?.id, // Lägg till user ID för att länka bokningen
        }),
      });

      if (response.ok) {
        setIsModalVisible(false); // Stäng modal
        router.push("/profile"); // Skicka användaren till profil eller bokningshistorik
      } else {
        console.error("Booking failed");
      }
    } catch (error) {
      console.error("Error during booking", error);
    }
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const isBooked = props.bookedDates.some((date) =>
      dayjs(date).isSame(current, "day")
    );
    return (current && current < dayjs().startOf("day")) || isBooked;
  };

  return (
    <>
      <Space direction="vertical" size={12}>
        <RangePicker
          disabledDate={disabledDate}
          value={range}
          onChange={setRange}
        />
      </Space>
      {token ? (
        <Button type="primary" onClick={handleBookNow} disabled={!range}>
          Book Now
        </Button>
      ) : (
        <Link href="/login">
          <Button type="primary">Login to Book</Button>
        </Link>
      )}

      {/* Modal för att bekräfta bokning */}
      <Modal
        title="Confirm Booking"
        visible={isModalVisible}
        onOk={handleConfirmBooking}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Check-In: {range ? dayjs(range[0]).format("YYYY-MM-DD") : ""}</p>
        <p>Check-Out: {range ? dayjs(range[1]).format("YYYY-MM-DD") : ""}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
        <p>Do you want to confirm this booking?</p>
      </Modal>
    </>
  );
};

export default DateRangePicker;

// "use client";

// import React, { useEffect, useState } from "react";
// import { Button, DatePicker, Space } from "antd";
// import type { GetProps } from "antd";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import { useUser } from "@/context/user";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import BookingModal from "./BookingModal"; // Importera modalkomponenten

// type RangePickerProps = GetProps<typeof DatePicker.RangePicker> & {
//   bookedDates: Date[];
//   listingId: string; // Ta emot listnings-ID
//   dailyRate: number; // Dagligt pris för listningen
// };

// dayjs.extend(customParseFormat);

// const { RangePicker } = DatePicker;

// const DateRangePicker = (props: RangePickerProps) => {
//   // const [range, setRange] = React.useState<typeof props.value>(null);
//   const [range, setRange] = React.useState<
//     [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
//   >(null);

//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const { token, user } = useUser();
//   const router = useRouter();
//   const [isClient, setIsClient] = useState(false);

//   // Kontrollera om vi är på klienten
//   useEffect(() => {
//     setIsClient(true); // När komponenten laddas på klienten, sätt isClient till true
//   }, []);

//   // Rendera ingenting tills vi vet att vi är på klienten
//   if (!isClient) {
//     return null;
//   }

//   useEffect(() => {
//     console.log("Token changed:", token);
//     setRange(null);
//   }, [token]);

//   useEffect(() => {
//     if (range && props.dailyRate) {
//       const [from, to] = range;
//       if (from && to) {
//         const isBooked = props.bookedDates.some(
//           (date) => dayjs(date).isAfter(from) && dayjs(date).isBefore(to)
//         );
//         if (isBooked) {
//           setRange(null);
//         }
//         // Beräkna totalpris
//         const daysBooked = dayjs(to).diff(dayjs(from), "day") + 1;
//         setTotalPrice(daysBooked * props.dailyRate);
//       }
//     } else {
//       setTotalPrice(0); // Om något saknas, sätt totalpris till 0
//     }
//   }, [props.bookedDates, range, props.dailyRate]);

//   const handleBookNow = () => {
//     setIsModalVisible(true); // Visa modal för bekräftelse
//   };

//   const handleConfirmBooking = async () => {
//     try {
//       const response = await fetch("/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           listingId: props.listingId,
//           checkInDate: range ? range[0] : null,
//           checkOutDate: range ? range[1] : null,
//           totalPrice,
//           createdById: user?.id, // Lägg till user ID för att länka bokningen
//         }),
//       });

//       if (response.ok) {
//         setIsModalVisible(false); // Stäng modal
//         router.push("/profile"); // Skicka användaren till profil eller bokningshistorik
//       } else {
//         console.error("Booking failed");
//       }
//     } catch (error) {
//       console.error("Error during booking", error);
//     }
//   };

//   const disabledDate: RangePickerProps["disabledDate"] = (current) => {
//     const isBooked = props.bookedDates.some((date) =>
//       dayjs(date).isSame(current, "day")
//     );
//     return (current && current < dayjs().startOf("day")) || isBooked;
//   };

//   return (
//     <>
//       <Space direction="vertical" size={12}>
//         <RangePicker
//           disabledDate={disabledDate}
//           value={range}
//           onChange={setRange}
//         />
//       </Space>
//       {token ? (
//         <Button type="primary" onClick={handleBookNow} disabled={!range}>
//           Book Now
//         </Button>
//       ) : (
//         <Link href="/login">
//           <Button type="primary">Login to Book</Button>
//         </Link>
//       )}

//       {/* Använda modal-komponenten */}
//       <BookingModal
//         open={isModalVisible}
//         onConfirm={handleConfirmBooking}
//         onCancel={() => setIsModalVisible(false)}
//         range={range}
//         totalPrice={totalPrice}
//       />
//     </>
//   );
// };

// export default DateRangePicker;

// "use client";

// import React, { useEffect } from "react";
// import { Button, DatePicker, Space } from "antd";
// import type { GetProps } from "antd";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import { useUser } from "@/context/user";
// import Link from "next/link";

// type RangePickerProps = GetProps<typeof DatePicker.RangePicker> & {
//   bookedDates: Date[];
// };

// dayjs.extend(customParseFormat);

// const { RangePicker } = DatePicker;

// const DateRangePicker = (props: RangePickerProps) => {
//   const [range, setRange] = React.useState<typeof props.value>(null);

//   // Använd useUser-hook för att kolla inloggningsstatus
//   const { user, token } = useUser();

//   useEffect(() => {
//     if (!token) {
//       setRange(null); // Rensa valda datum när användaren loggar ut
//     }
//   }, [token]); // Körs när token ändras

//   useEffect(() => {
//     if (range) {
//       const [from, to] = range;
//       if (from && to) {
//         //TODO: check if the dates are valid and range does not contain booked dates
//         const isBooked = props.bookedDates.some(
//           (date) => dayjs(date).isAfter(from) && dayjs(date).isBefore(to)
//         );
//         console.log("isBooked", isBooked);
//         if (isBooked) {
//           setRange(null);
//           return;
//         }
//       }
//     }
//   }, [props.bookedDates, range]);

//   const disabledDate: RangePickerProps["disabledDate"] = (current) => {
//     // Can not select days before today and today
//     const isBookded = props.bookedDates.some((date) =>
//       dayjs(date).isSame(current, "day")
//     );
//     return (current && current < dayjs().startOf("day")) || isBookded;
//   };
//   console.log("range", range);
//   return (
//     <>
//       <Space direction="vertical" size={12}>
//         <RangePicker
//           disabledDate={disabledDate}
//           value={range}
//           onChange={setRange}
//         />
//       </Space>
//       {/* Om användaren är inloggad, visa "Book Now", annars "Login to Book" */}
//       {token ? (
//         <Button type="primary" onClick={() => console.log("Booking...")}>
//           Book Now
//         </Button>
//       ) : (
//         <Link href="/login">
//           <Button type="primary">Login to Book</Button>
//         </Link>
//       )}
//     </>
//   );
// };

// export default DateRangePicker;

// Måste vara i client komponent
// context
// book form, skapa bok
