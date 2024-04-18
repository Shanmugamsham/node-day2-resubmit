const routers=require("express").Router()
const hallData = require("../halldata");
const bookingData = require("../bookingdata");



routers.get("/", (req, res) => {
    res.status(200).send("<h1>Welcome to Hall Booking App</h1>");
  })

routers.get("/rooms", (req, res) => {
    res.status(200).json({
      RoomsAvailable: hallData,
    });
  })

  routers.post("/rooms", (req, res) => {
    let result = [];
    req.body.rooms.forEach((room) => {
      let isPresent = hallData.find((temp) => temp.roomId === room.roomId);
      let roomId = room.roomId;
      if (isPresent === undefined) {
        hallData.push(room);
        console.log(room);

        result.push({ Id: roomId, status: "Created" });
      } else {
        result.push({
          Id: roomId,
          roomCreationStatus: " Room Id Already Exists!! Use Another Room Id",
        });
      }
    });

    res.status(200).json({
      roomCreationStatus: result,
    });
  })

  routers.get("/bookedRooms", (req, res) => {
    let data = bookingData;

    let output = [];

    data.forEach((bookedRooms) => {
      let roomData = hallData.find(
        (room) => room.roomId === bookedRooms.roomId
      );

      let obj = {
        roomName: roomData.roomName,
        bookedStatus: bookedRooms.status,
        customerName: bookedRooms.customerName,
        date: bookedRooms.date,
        startTime: bookedRooms.startTime,
        endTime: bookedRooms.endTime,
      };

      output.push(obj);
    });

    res.status(200).json({
      bookedRooms: output,
    });
  })
  routers.post("/bookedRooms", (req, res) => {
    let flag;

    let result = [];

    req.body.bookingDetails.forEach((room) => {
      flag = 1;
      let roomData = bookingData.find((rooms) => {
        if (rooms.roomId === room.roomId) {
          console.log("room id's equal");

          let bookingDate = dayjs(room.date);

          let bookedDate = dayjs(rooms.date);

          console.log(bookingDate.isSame(bookedDate));

          if (bookingDate.isSame(bookedDate)) {
            console.log("Booking date already exists");
            let bookedStartTime = +room.startTime;

            let bookedEndTime = +room.endTime;

            let bookingTime = +rooms.startTime;

            if (
              (bookingTime < bookedEndTime &&
                bookedStartTime >= bookingTime) ||
              bookingTime === bookedStartTime
            ) {
              result.push({
                roomId: room.roomId,
                status: "A booking Already Exists on given time",
              });

              flag = 0;
            }
          }
        }
      });
      if (flag === 1) {
        room["status"] = "confirm";
        bookingData.push(room);
        result.push({
          roomId: room.roomId,
          status: "Booking Confirmed",
        });
      }
    });

    res.status(200).json({
      bookingStatus: result,
    });
  })
  routers.get("/customers", (req, res) => {
    let data = bookingData;

    let output = [];

    data.forEach((bookedRooms) => {
      let roomData = hallData.find(
        (room) => room.roomId === bookedRooms.roomId
      );

      let obj = {
        customerName: bookedRooms.customerName,
        roomName: roomData.roomName,
        date: bookedRooms.date,
        startTime: bookedRooms.startTime,
        endTime: bookedRooms.endTime,
      };

      output.push(obj);
    });

    res.status(200).json({
      customerData: output,
    });
  })

  routers.get("/customers/:name", (req, res) => {
    const customerName = req.params.name;
    let allData = bookingData.filter(
      (book) => book.customerName == customerName
    );
    allData = allData.map((data) => {
      let room = hallData.find((e) => e.roomId == data.roomId);
      return {
        "Customer Name": `${data.customerName}`,
        "Room Name": `${room.roomName}`,
        Date: `${data.date}`,
        "Start Time": `${data.start}`,
        "End Time": `${data.end}`,
        "Booking id": `${data.bookingId}`,
        "Booking date": `${data.date}`,
        "Booking Status": `${data.status}`,
      };
    });
    if (allData.length) {
      res.json(allData);
    } else {
      res.status(404).json({
        message:
          "Request Customer details N/A or customer not yet booked rooms",
      });
    }
  })









module.exports=routers