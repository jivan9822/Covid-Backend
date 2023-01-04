###Backend Developer Assignment

## ADMIN ROUTES

# POST /admin/addDose

    You have to pass date of the month from body to add all doses for entire month
    ex. {"date": "2023-01-01"}

# GET /admin/users

    You can get data of all register users and having all filter, sort, limitFields and pagination also.

# GET /admin/bookings

    You can get data of all vaccination bookings and having all filter, sort, limitFields and pagination also.

## USER ROUTES

# POST /user/register

    Pass fname, lname, mobileNumber, age, pinCode, aadharNumber, password from body to register a user
    ex.
    {
    "fname": "Amit",
    "lname": "Kumar",
    "mobileNumber": "7867564525",
    "age": "42",
    "pinCode": "400072",
    "aadharNumber": "1234 1234 1237",
    "password": "12345password"
    }

# POST /user/login

    You have to pass mobileNumber and password of user to login from body
    {
    "mobileNumber": "9822442282",
    "password": "12345password"
    }

# POST /user

    UserProfileUpdate:
    User can update his profile using user route
    User can update only following fields from req body
    {
    "fname": "Jivan",
    "lname": "Toshniwal",
    "mobileNumber": "9822442282",
    "age": "32",
    "pinCode": "400072",
    "aadharNumber": "1234 1234 1234",
    "password": "12345password"
    }

# GET /user

    User can get his details using this route

## BOOKING ROUTES

# GET /book/data

    This route is using for get the availability of slot for vaccination. You have to send a day from req body to get the availability details.
    {
    "day": "2/1/2023"
    }

# POST /book/book

    This route is for booking the route.
    In this route you have to pass day with time and dose first/second to book the particular slot
    {
    "day": "3/1/2023-10:00:00",
    "dose": "first"
    }

# POST /book/update

    This route is for update booking. You have to pass body as follow to update
    NOTE: Update only possible before 24 hours of your original booking.
    {
    "day": "6/1/2023-16:30:00",
    "dose": "first"
    }

# DEL /book/cancel

    This route is to cancel your vaccination booking
    NOTE: Cancel only possible before 24 hours of your original booking.
