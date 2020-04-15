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

**Description**: The user collection will store all users. Users will be able to log in, update their details, and post comments. An array of the comment id is the user-created, an array of the comment id is the user has voted on and an array of ticketInfo is the user-bought tickets.

```json
{
    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "userName": "JJ Doeny",
    "email": "JDoe@gmail.com",
    "phoneNumber": 5513008708,
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
    ]
}
```

| Name           | Type   | Description                                               |
| :------------- | :----- | :-------------------------------------------------------- |
| \_id           | string | A globally unique identifier to represent the user.       |
| userName       | string | User name                                                 |
| phoneNumber    | number | User phone number                                         |
| address        | string | User address                                              |
| zipCode        | string | User address zip code                                     |
| userComments   | array  | An array that stores the comment_id that users created.   |
| votedComments  | array  | An array that stores the comment_id which users voted on. |
| hashPassword   | string | The password when users log in.                           |
| userTicketInfo | array  | The ticket that the user bought.                          |

#### Ticket Collection

**Description**: The ticket collection will store all tickets. A ticket will include the information of user id, ticket number, the data when ticket is booked, the date when ticket will be used and the price of this ticket.

```json
{
    "_id": "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710",
    "userId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "placeId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "ticketNo": "000058",
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
| ticketNo    | number | A number printed on the ticket.                                |
| orderedDate | date   | The date the user bought the ticket.                           |
| effectDate  | date   | The date ticket takes effect.                                  |
| price       | number | The prices of the ticket.                                      |

#### Comments Collection

**Description**: The doc of comments is a subdocument of the place collection.

```json
{
    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "userId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
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
| userId     | string | The userId of the person who posted the comment. |
| placeId    | string | The place the ticket takes effect on.            |
| comment    | string | The comment text.                                |
| votedCount | number | The upvoted count of the comment.                |
| votedUsers | array  | The user voted this comment                      |

#### Places Collection

**Description**: The place collection will store all the places. Each place will have descriptive content that will introduce the details of the place. An array of the comment id is the user-created about this place. Users will be able to comment on the place.

```json
{
    "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "description": "This place is a famous school in Hoboken NJ.",
    "placeName": "Stevens Institute of Technology",
    "placeAddress": "1 Castle Point Terrace, Hoboken",
    "placeZipCode": "07030",
    "placePrice": "100",
    "placeUserComments": [
        "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"
    ]
}
```

| Name              | Type   | Description                            |
| :---------------- | :----- | :------------------------------------- |
| \_id              | string | The place id.                          |
| description       | string | The descriptive content of this place. |
| placeName         | string | The name of this place.                |
| placeAddress      | string | The address of this place.             |
| placeZipCode      | string | The zip code of this place.            |
| placePrice        | string | The price for the place                |
| placeUserComments | array  | Comments user comment on this place.   |
