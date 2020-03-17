# Ticket for Tourism

## Group members listed here:

**Mo Sun, Yuqi Wang, Zechen Feng, Xunzhi Li**

### Description

The idea of the application is to allow users to book tickets for tourism. The value of the application is apparent, many organizations like museum will need their own websites to sell tickets.

### Core features

1. Main page
   The main page after login will show the tickets that users can book. The user can change the sorting of tickets either by the "latest" ticket or the "hottest" ticket which sells most. The user can also search for tickets based on keywords or categories like "Art museum".
2. Detail page
   This page will show the detail of the ticket, which would include some pictures and text. Also, it will have a book button for users to book this ticket.
3. User center page
   This page is for users to have a look at his/her information and his tickets. On this page, there will be two toggles on the left.
    - The first part is user information. In this part, users can view and change their personal information, like name, phone number, email.
    - The second part is the ticket information. In this part, users can view their booked tickets. They can also reschedule their ticket time or cancel their ticket.
4. Comment
   Users can post comments for the tickets which will be displayed on the detail page in the order of posted time.

### Extra features:

1. Payment information
   People can add payment information in the user center page. We do not check whether the payment information is real in the world, but we will check the format of the information. For instance, we will check whether the card number is all digits and its length.
2. Other people’s information
   Users can add other people’s information so that they can buy tickets for other people.

### Database

#### Users Collection

**Description**:This collection will store basic details of all users who create an account on the application. Details such as Full Name, Username, Password, Email Address, and Nationality. This object will be created when user signs up, and is used to verify the login info. This collection will also store all the information related to the user’s preferences for the itinerary generation. This includes the type of tour, destination, budget, travel dates, meal preferences etc. This object is created when the user submits the itinerary preference form.

```json
{
    "_id": ObjectId("5db0ce05a5778f23dad348d1"),
    "gender": "male",
    "dob": "04/21/1995",
    "firstName": "Lun-Wei",
    "lastName": "Chang",
    "email": "lchang6@stevens.edu",
    "password": "5f4dcc3b5aa765d61d8327deb882cf99",
    "nationality": ["Taiwanese"],
    "userPreferences": {
        "mealPreference": {
            "vegan": false,
            "Vegetarian": false,
            "whiteMeat": true,
            "redMeat": true,
            "seafood": true,
            "eggs": false
        },
        "tourActivity": "relaxed",
        "tourType": ["hiking", "adventureSports"],
        "noOfTravelers": 4,
        "specialNeeds": true,
        "budget": 10000,
        "destination": "New Jersey",
        "travelDates": {
            "start": "01/01/2020",
            "end": "01/15/2020"
        }
    },
    "itinerary": {
        "day1": [
            {
                "name": "Burj Khalifa",
                "location": "Sheikh Zayed Road",
                "cost": 41,
                "avgTimeSpent": 2,
                "type": event
                //type is either restaurant or event
            }
        ]
    }
}
```

| Name                           | Type        | Description                                                                                                                               |
| :----------------------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| \_id                           | ObjectId    | A unique MongoDB identifier to represent the user.                                                                                        |
| gender                         | string      | User’s gender                                                                                                                             |
| dob                            | Date object | User’s date of birth                                                                                                                      |
| firstName                      | string      | First name of user                                                                                                                        |
| lastName                       | string      | Last name of user                                                                                                                         |
| email                          | string      | User’s email address                                                                                                                      |
| password                       | string      | A hashed string representing the user’s password                                                                                          |
| nationality                    | array       | A string array of all nationalities the user has or holds a citizenship of.                                                               |
| userPreferences                | object      | Object holding all the data related to user’s tour preferences such as food, tourType etc.                                                |
| userPreferences.mealPreference | object      | Keys represent different meal preferences and values are booleans signifying whether the user can or cannot have that specific meal type. |
| userPreferences.tourType       | array       | An array of types of experiences the user is interested in for their tour.                                                                |
| userPreferences.noOfTravelers  | int         | Number of travelers going on the tour.                                                                                                    |
| userPreferences.specialNeeds   | array       | An array of any special needs the user or anyone in their travel group may have.                                                          |
| userPreferences.budget         | int         | Maximum funds the user is willing to spend on their tour; the default currency is dollars.                                                |
| userPreferences.destination    | string      | Location where the user wishes to go for their tour.                                                                                      |
| userPreferences.travelDates    | object      | The start and end date when the user wishes to travel. The values are of type Date object.                                                |

#### Destinations Collection

**Description**: This collection will store all the information related to various destinations. The destinations data is pre-generated before users use the platform. This collection will also store all the information related to the country's customs such as on arrival visas, vaccinations required to enter the country, a list of prohibited items, etc. The country’s customs data is pre-generated before users use the platform.

```json
{
    "_id": ObjectId("5d93f38389a490113aa11c11"),
    "d_name": "New Jersey",
    "country": "USA",
    "weather": [
        {
            "month": "January",
            "avgHigh": 25,
            "avgLow": 15,
            "rain": true
        }
    ],
    "thingsToDo": [
        {
            "name": "Six Flags Great Adventure",
            "location": "1 Six Flags Blvd, Jackson, NJ 08257",
            "type": "Leisure",
            "avgCostPerPerson": 100,
            "avgTimeSpent": 10,
            "accessibility": true,
            "specialNeeds": true
        }
    ],
    "restaurants": [
        {
            "name": "Pizzeria Hoboken",
            "location": "723 Jefferson Street, Hoboken, NJ 07030",
            "cuisine": ["Italian"],
            "mealPreferences": ["Vegan", "White Meat"],
            "avgCostPerPerson": 15,
            "specialNeeds": true
        }
    ],
    "countryCustoms": {
        "onArrivalVisas": ["Canada"],
        "restricted": ["Iraq"],
        "vaccinations": [],
        "cashLimit": 10000,
        "prohibitedItems": [
            "5vjlel8893020f23dad348d1",
            "5vjlel8893020f23dad348d2"
        ],
        "laws": ["5vj093848820f23dad348d1", "5vj093848820f23dad348d2"]
    }
}
```

| Name                            | Type     | Description                                                                                                                  |
| :------------------------------ | :------- | :--------------------------------------------------------------------------------------------------------------------------- |
| \_id                            | ObjectId | A unique MongoDB identifier to represent a specific destination.                                                             |
| d_name                          | string   | Name of destination                                                                                                          |
| country                         | string   | Name of country                                                                                                              |
| weather                         | array    | Array of twelve objects representing weather during each month of the year in the destination.                               |
| packingList                     | array    | Array of \_ids of items to pack for this destination from the Packing Collection.                                            |
| thingsToDo                      | array    | An array of objects each specifying a particular experience with its location, cost and type.                                |
| restaurants                     | array    | An array of objects specifying popular restaurants in the destination with their location, type and average cost per person. |
| countryCustoms                  | object   | Object holding all the data related to the country's customs such as restricted nationalities, cash limit, or laws.          |
| countryCustoms.onArrivalVisas   | array    | Array of strings representing all nationalities that receive a VISA on arrival by default.                                   |
| countryCustoms.restricted       | array    | A string array with a list of nationalities that are restricted to visit this country.                                       |
| countryCustoms.vaccinations     | array    | A string array of all vaccinations that are mandatory in order to visit this country.                                        |
| countryCustoms.cashLimit        | int      | Maximum amount in cash permitted to be brought into this country.                                                            |
| countryCustoms.prohibited Items | array    | A string array that consists of \_ids of all items prohibited in this country from the Prohibited Items Collection.          |
| countryCustoms.laws             | array    | A string array that consists of \_ids of all laws to be followed in this country from the Laws Collection.                   |

#### Laws Collection

**Description**: The collection will store a list of laws with a unique id and a description. The law’s description will specify the details of the law. The laws data is pre-generated before users use the platform.

```json
{
    "_id": ObjectId("5vj093848820f23dad348d1"),
    "description": "Drinking on the street is not allowed."
}
```

| Name        | Type     | Description                                               |
| :---------- | :------- | :-------------------------------------------------------- |
| \_id        | ObjectId | A unique MongoDB identifier to represent a group of laws. |
| description | string   | A string specifying the details of the law.               |

#### Prohibited Items Collection

**Description**: This collection will store a list of prohibited items’ names. The prohibited items will include things such as firearms, knives, drugs or certain food items. The prohibited item data is pre-generated before users use the platform.

```json
{
    "_id": ObjectId("5vjlel8893020f23dad348d1"),
    "item_name": "guns"
}
```

| Name      | Type     | Description                                                 |
| :-------- | :------- | :---------------------------------------------------------- |
| \_id      | ObjectId | A unique MongoDB identifier to represent a prohibited item. |
| item_name | string   | The name of a single prohibited item.                       |

#### Packing Collection

**Description**: This collection will store the type and items needed in the user’s packing list. The packing type string could be things such as hiking, business, or weather that would describe a collection of items that user needed for his/her specific type of trip. The items array would include a list of things needed for the particular type of trip. The packing data is pre-generated before users use the platform.

```json
{
    "_id": ObjectId("5vj0ce05a5784820f23dad348d1"),
    "type": "hiking",
    "items": ["clothes", "backpack", "snacks", "water bottle"]
}
```

| Name  | Type     | Description                                                                                |
| :---- | :------- | :----------------------------------------------------------------------------------------- |
| \_id  | ObjectId | A unique MongoDB identifier to represent a packing type.                                   |
| type  | string   | The type that describes the packing categories such as hiking, winter, summer or business. |
| items | array    | A string array with a list of items that should be included in the user’s packing list.    |
