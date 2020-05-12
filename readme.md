# Ticket for Tourism

## Group members listed here:

**Mo Sun, Yuqi Wang, Zechen Feng, Xunzhi Li**

-   [Ticket for Tourism](#ticket-for-tourism)

    -   [Description](#description)
    -   [Deployment](#deployment)
        -   [Install](#install)
        -   [Launch](#launch)
        -   [Dependencies](#dependencies)
        -   [DevDependencies](#devdependencies)
    -   [Core features](#core-features)
    -   [Extra features:](#extra-features-)
    -   [Database](#database)

        -   [Users Collection](#users-collection)
            -   [Users API](#api)
        -   [Ticket Collection](#ticket-collection)
            -   [Tickets API](#api-1)
        -   [Comments Collection](#comments-collection)
            -   [Comments API](#api-2)
        -   [Places Collection](#places-collection)
            -   [Places API](#api-3)
        -   [Friends collection](#friends-collection)
            -   [Friends API](#api-4)
        -   [Banks collection](#banks-collection)
            -   [Bank API](#api-5)

    -   [Other](#other)
        -   [Counts collection](#counts-collection)
        -   [Format](#format)
        -   [Cookie](#cookie)
        -   [Http Status Code](#http-status-code)

### Description

The idea of the application is to allow users to book tickets for tourism. The value of the application is apparent, many organizations like museum will need their own websites to sell tickets.

### Deployment

#### Install

Execute the following commands to download the source code

```
$ git clone https://github.com/htkz/CS-546-FinalProject.git
$ cd CS-546-FinalProject
```

Execute the following commands to install dependencies

Using **npm**

```
$ npm install
```

#### Launch

Under CS-546-FinalProject's root directory, execute the following commands to launch

```
$ npm run seed
$ npm start
```

Visit http://127.0.0.1:3000/, and enjoy it!

#### Dependencies

| name               | version |
| :----------------- | :------ |
| bcryptjs           | 2.4.3   |
| cookie-parser      | 1.4.5   |
| express            | 4.17.1  |
| express-handlebars | 4.0.3   |
| express-session    | 1.17.1  |
| mongodb            | 3.5.4   |
| nodemon            | 2.0.2   |
| xss                | 1.0.6   |

#### DevDependencies

| name          | version |
| :------------ | :------ |
| node-sass     | 4.13.1  |
| onchange      | 6.1.0   |
| parallelshell | 3.0.1   |

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

**Description**: The user collection will store all users. Users will be able to log in, update their details, and post comments. An array of the comment id is the user-created, an array of the comment id is the user has voted on and an array of ticketInfo is the user-bought tickets.

```json
{
    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "userName": "JJ Doeny",
    "email": "JDoe@gmail.com",
    "phoneNumber": "5513008708",
    "address": "1 Castle Point Terrace, Hoboken",
    "zipCode": "07030",
    "hashedPassword": "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    "userTicketInfo": [
        "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"
    ],
    "userComments": [
        "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"
    ],
    "votedComments": [
        "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"
    ],
    "friends": [
        "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"
    ],
    "bankCard": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310"
}
```

| Name           | Type   | Description                                               |
| :------------- | :----- | :-------------------------------------------------------- |
| \_id           | string | A globally unique identifier to represent the user.       |
| userName       | string | User name.                                                |
| phoneNumber    | string | User phone number.                                        |
| address        | string | User address.                                             |
| zipCode        | string | User address zip code.                                    |
| hashedPassword | string | The password when users log in.                           |
| userTicketInfo | array  | The ticket that the user bought.                          |
| userComments   | array  | An array that stores the comment_id that users created.   |
| votedComments  | array  | An array that stores the comment_id which users voted on. |
| friends        | array  | The friends that the user added.                          |
| bankCard       | String | The bankId.                                               |

##### API

-   **get("/account/:id")**: use userId to get user from users collection.

-   **get("/")**: get all users from users collection.

-   **get("/logout")**: logout user and delete cookie.

-   **get("/tickets/:id")**: use userId to get user's tickets from tickets collection.

-   **get("/tickets/friends/:id")**: user userId to get user's friends' tickets from tickets collection.

-   **get("/friends/:id")**: use userId to get user's friends from friends collection.

-   **post("/account/username")**: use username to get user from users collection.  
    _Fields_: userName

-   **post("/account/email")**: use email to get user from users collection.  
    _Fields_: email

-   **post("/account/register")**: add user data into users collection.  
    _Fields_: userName, email, hashedPassword

-   **post("/account/login")**: get data through email. Save username in the cookie.
    _Fields_: email, hashedPasswor"

-   **put("/account/update/:id")**: use userId to update user infomation.  
    _Fields_: userName, phoneNumber, email, address, zipCode, bio

-   **put("/account/password/:id")**: use userId to update user password.  
    _Field_: oldPassword, newPassword

-   **delete("/:id")**: delete user through userId from users collection.

#### Ticket Collection

**Description**: The ticket collection will store all tickets. A ticket will include the information of user id, ticket number, the data when ticket is booked, the date when ticket will be used and the price of this ticket.

```json
{
    "_id": "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710",
    "userId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "placeId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "ticketNo": "994920342",
    "orderedDate": "2020-03-04 15:02:00",
    "effectDate": "2020-05-18",
    "price": "25.00"
}
```

| Name        | Type   | Description                                                    |
| :---------- | :----- | :------------------------------------------------------------- |
| \_id        | string | A globally unique identifier to represent the ticket.          |
| userId      | string | A globally unique identifier to represent who owns the ticket. |
| placeId     | string | The place the ticket takes effect on.                          |
| ticketNo    | string | A number printed on the ticket.                                |
| orderedDate | date   | The date the user bought the ticket.                           |
| effectDate  | date   | The date ticket takes effect.                                  |
| price       | string | The prices of the ticket.                                      |

**ticketNo**: "9949 2034 2"  
_First part(9949)_ is the place identifier which is last two number place id's ascii.  
_Second part(2034)_ is date.  
_Last part(2)_ is auto increment number.

##### API

-   **get("/:id")**: use ticketId to get ticket from tickets collection

-   **get("/")**: get all tickets from tickets collection

-   **post("/)**: post tikcet data into tickets collection.  
    _Fields_: persons, placeId, orderedData, effectDate, price

    ```json
    persons
    {
        "user": "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710",
        "friends": [
            "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710",
            "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"
        ]
    }
    ```

-   **put("/:id")**: use placeId to update place infomation.  
    _Fields_: ticketId, effectDate

-   **delete("/user/:id")**: delete ticket through ticketId from tickets collection.

-   **delete("/user/:id")**: delete ticket through ticketId from tickets collection.

#### Comments Collection

**Description**: The doc of comments is a subdocument of the place collection.

```json
{
    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "user": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "placeId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "comment": "You should go with the pixel!",
    "votedCount": 10,
    "votedUsers": [
        "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"
    ]
}
```

| Name       | Type   | Description                                      |
| :--------- | :----- | :----------------------------------------------- |
| \_id       | string | The comment ID.                                  |
| user       | string | The userId of the person who posted the comment. |
| placeId    | string | The place the ticket takes effect on.            |
| comment    | string | The comment text.                                |
| votedCount | number | The upvoted count of the comment.                |
| votedUsers | array  | The user voted this comment.                     |

##### API

-   **get("/:id")**: use commentId to get comment from comments collection.

-   **get("/")**: get all comments from comments collection.

-   **post("/")**: post comment data into comments collection.  
    _Fields_: userId, placeId, comment, votedCount

-   **put("/:id")**: use commentId to update comment infomation.  
    _Fields_: commentId, votedCount, votedUserId

-   **delete("/:id")**: delete comment through commentId from comments collection.

#### Places Collection

**Description**: The place collection will store all the places. Each place will have descriptive content that will introduce the details of the place. An array of the comment id is the user-created about this place. Users will be able to comment on the place.

```json
{
    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "description": "This place is a famous school in Hoboken NJ.",
    "placeName": "Stevens Institute of Technology",
    "placeAddress": "1 Castle Point Terrace, Hoboken",
    "placeZipCode": "07030",
    "placePrice": 100,
    "category": ["quiet", "amazing"],
    "displayTime": "2020-3-1",
    "remainNum": 300,
    "images": ["image1.jpg", "image2.jpg"],
    "placeUserComments": [
        "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"
    ]
}
```

| Name              | Type   | Description                              |
| :---------------- | :----- | :--------------------------------------- |
| \_id              | string | The place id.                            |
| description       | string | The descriptive content of this place.   |
| placeName         | string | The name of this place.                  |
| placeAddress      | string | The address of this place.               |
| placeZipCode      | string | The zip code of this place.              |
| placePrice        | number | The price for the place.                 |
| category          | array  | The category for the place.              |
| displayTime       | string | The display time for the place.          |
| remainNum         | number | The remain tickets number for the place. |
| images            | array  | The image array of the place.            |
| placeUserComments | array  | Comments user comment on this place.     |

##### API

-   **get("/:id")**: use placeId to get place from places collection.

-   **get("/placeComments/:id")**: use placeId to get this place all comments.

-   **get("/")**: get all places from places collection.

-   **post("/")**: post place data into places collection.  
    _Fields_: placeName, description, placeAddress, placeZipCode, placePrice, category, displayTime, remainNum, images

-   **patch("/:id")**: use placeId to update place infomation.  
    _Fields_: placeId, newPlaceName, newDescription, newPlaceAddress, newPlaceZipCode, newPlacePrice, newCategory, newDisplayTime, newRemainNum, newImages

-   **delete("/:id")**: delete place through placeId from places collection.

#### Friends collection

**Description**: The friends collection will store all friends. Each friend have an userId which is the user has account in our website. The friend has name, email and address to get ticket from the website. A array tickets to store all tickets

```json
{
    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "userId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "name": "group13",
    "email": "group13@gmail.com",
    "phoneNumber": "5512612933",
    "tickets": [
        "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310"
    ]
}
```

| Name        | Type   | Description                     |
| :---------- | :----- | :------------------------------ |
| \_id        | string | The friend id.                  |
| userId      | string | The userId                      |
| name        | string | The friend user name.           |
| email       | string | The friend email.               |
| phoneNumber | string | The friend phone number         |
| tickets     | array  | The ticket that the friend had. |

##### API

-   **get("/:id")**: use friendId to get friend from friends collection.

-   **post("/")**: add a friend into friends collection.  
    _Fields_: userId, name, email, phoneNumber

-   **put("/:id")**: user friendId to update friend infomation.  
    _Fields_: name, email, phoneNumber

#### Banks collection

**Description**: The banks collection will store all banks card information. Each bank card have an userId which is the user has this bank. The friend has first name, last name, billing zipcode, card number, expiration date, securityCode

```json
{
    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "userId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "firstName": "group13",
    "lastName": "group13",
    "cardNumber": "4024007193132510",
    "billingZipCode": "07302",
    "expirationDate": "05/23",
    "securityCode": "123"
}
```

| Name           | Type   | Description          |
| :------------- | :----- | :------------------- |
| \_id           | string | The friend id.       |
| userId         | string | The userId.          |
| firstName      | string | The first name.      |
| lastName       | string | The last name.       |
| cardNumber     | string | The card number.     |
| billingZipCode | string | The billing zip code |
| expirationDate | string | The expiation date   |
| securityCode   | string | security code        |

##### API

-   **get("/:id")**: use bankId to get bank from banks collection.

-   **post("/")**: add a bank card into banks collection.  
    _Fields_: user, fristName, lastName, billingZipCode, expirationDate, securityCode

-   **put("/:id")**: user bandId to update friend infomation.  
    _Fields_: fristName, lastName, billingZipCode, expirationDate, securityCode

#### Counts collection

**Description**: The banks collection is used to implement auto increased.

```json
{
    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "sequenceValue": 1
}
```

| Name          | Type   | Description         |
| :------------ | :----- | :------------------ |
| \_id          | string | The auto name.      |
| sequenceValue | number | The sequence value. |

### Other

#### Format

-   **userName**: 3-16 characters, only contains lower case word, upper case word & number
-   **email**: basic email format
-   **password**:
    1. 8-16 characters
    2. Should only contains lower case word, upper case word & number

#### Cookie

The cookie just store user's username and \_id.
When user logs in the account, the cookie will store user's username and \_id.
When user logs out the account, the cookie will delete.
**Field**: req.session.user

#### Http Status Code

| Status Code | Status Code Name      | Description                                                                                                           |
| :---------- | :-------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| 200         | OK                    | Standard response for successful HTTP requests. succeeded.                                                            |
| 400         | Bad Request           | The server cannot or will not process the request due to an apparent client error.                                    |
| 401         | Unauthorized          | the user does not have valid authentication credentials for the target resource.                                      |
| 404         | Not Found             | The requested resource could not be found but may be available in the future.                                         |
| 500         | Internal Server Error | A generic error message, given when an unexpected condition was encountered and no more specific message is suitable. |
