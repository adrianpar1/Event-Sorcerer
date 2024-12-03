# Event Sorcerer Databases

## Steps to run this project

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command

## Database Information

### Event Details ("/event")

This database contains information about individual events. It contains sections such as \
event information and RSVP information. This database contains Itinerary and Participants.

The EventDetails parameters are shown below with their types (written as pseudocode).

```
EventDetails:
    eventName: string,
    eventDate: date,
    eventTime: time,
    eventLocation: string,
    eventDescription: string,
    rsvpLink: string,
    rsvpDueDate: date,
    rsvpDueTime: time,
    id: number,                 // this is automatically generated; it should not be initialized
```

## Itinerary ("/itinerary")

This database contains information about an event's itinerary. It manages subevents that \
correspond to a larger event. Its parent database is EventDetails.

The Itinerary parameters are shown below with their types (written as pseudocode).

```
Itinerary:
    subeventName: string,
    subeventDate: date,
    subeventTime: time,
    subeventPoc: string,
    subeventDescription: string,
    eventId: number,                // corresponds to the id of the larger event
    subeventOrder: number,          //
    id: number,                     // this is automatically generated; it should not be initialized
```

## Participant ("/participant")

This database contains information about an event's participants. It manages information \
about the organizers and guests for an event. Its parent database is EventDetails.

The Participant parameters are shown below with their types (written as pseudocode).

```
Participant:
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    username: string,
    admin: boolean,
    eventId: number,        // corresponds to the id of the larger event
    id: number,             // this is automatically generated; it should not be initialized
```

## User ("/user")

This database contains information about the users that access the website. It contains \
information like username, email, and password. The password is hashed before displayed; \
the unhashed password is not displayed.

The User parameters are shown below with their types (written in pseudocode).

```
User:
    username: string,
    password: string,                   // hidden from public view
    hashedPassword: string,
    email: string,
    role: string,
    company: string,
    id: number,                         // this is automatically generated; it should not be initialized
```
