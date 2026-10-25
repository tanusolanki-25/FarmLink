# FarmLink

**Smart farmer procurement coordination system.** Farmers book a procurement slot, get a digital token, and watch their place in the queue live, instead of waiting in long lines with no information.

**Live demo:** https://farm-link-sand.vercel.app/

Admin overview
<img width="1752" height="918" alt="image" src="https://github.com/user-attachments/assets/dbe87d52-7249-4341-ac1c-da95390488e5" />
1.
<img width="1705" height="646" alt="image" src="https://github.com/user-attachments/assets/dc310c27-3485-4c25-9013-4eb66b8b883c" />
2.
<img width="1689" height="828" alt="image" src="https://github.com/user-attachments/assets/2217815f-b4f1-49e8-abdb-72939e02f46f" />
3.
<img width="1714" height="768" alt="image" src="https://github.com/user-attachments/assets/199812b1-044a-4826-9e20-393c4e18f15c" />
4.
<img width="1723" height="767" alt="image" src="https://github.com/user-attachments/assets/f84ac971-bd1e-4549-85fc-7300451f013e" />
5.
<img width="1668" height="847" alt="image" src="https://github.com/user-attachments/assets/b4251396-bff2-46d9-8312-c46aefdd5df9" />


## The problem

At procurement centers, farmers often wait for hours with:

- no idea how long the wait will be
- manual, paper-based token handling
- overcrowding and no record of what was procured or paid

## What FarmLink does

FarmLink digitizes the whole journey: **book slot, get token, track queue, verify, weigh, approve, payment status.**

### Farmer
- Register, log in, complete profile (village, district, state)
- Find nearby procurement centers sorted by distance
- Book a slot with crop and approximate quantity, and receive a digital token
- See live queue position, people ahead and estimated wait time
- Track booking and payment status, cancel a booking

### Officer (added by Admin)
- See today's bookings for their own center
- Call the next token (farmers' screens update instantly)
- Verify the farmer, record the actual weight and quality, approve or reject
- Mark the booking completed

### Admin
- Dashboard with totals, booking status breakdown and payments
- Center-wise report: today's load against capacity
- Create, edit and delete centers
- Add officers and assign or move them between centers
- View all users

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL with Prisma ORM |
| Auth | JWT, bcrypt, role-based access control |
| Real-time | Socket.IO (one room per center) |
| Cache / counters | Redis (Upstash) |
| Deployment | Vercel (frontend), Render (backend) |

## How it works

```
React app  <--REST (Axios)-->  Express API  <-->  PostgreSQL (Prisma)
    ^                              |
    |                              +-->  Redis (token counter, current token, locks)
    +------ Socket.IO events ------+
```

**Role-based access.** Login returns a JWT containing the user's role. `verifyToken` checks the user is logged in and `checkRole` checks the role is allowed for that route. Only Farmers can self-register. The Admin is seeded, and Officers are created by the Admin.

**Unique tokens with Redis.** Each booking gets its token from Redis `INCR`, which is atomic, so two farmers booking at the same moment never get the same token. A short Redis lock also blocks double-click bookings.

**Live queue with Socket.IO.** When an officer calls the next token, the server updates the current token in Redis and emits an event to that center's room. Farmers at that center refresh their status without reloading the page.

**Estimated wait time.** Calculated from the officer's recent speed (average gap between the last 10 "next token" calls), not a fixed number.

**Booking rules.** One active booking per farmer per date, no bookings in the past, and no bookings beyond a center's daily capacity.

## Database design

`User` holds common login data for every role. Role-specific data lives in `Farmer` and `Officer`.

```
User ──< Farmer ──< Booking >── Center
  └──── Officer ────────────────┘
Booking ── Queue
        ── Procurement (crop, verified quantity, quality)
        ── Payment (amount, status)
```

## API overview

| Area | Base path | Access |
|---|---|---|
| Auth | `/api/auth` (`register`, `login`) | Public |
| Farmer | `/api/farmer` (profile, centers, nearby-centers, book-slot, my-bookings, queue) | Farmer |
| Officer | `/api/officer` (today, verify, procurement, approve, reject, call-next, complete) | Officer |
| Admin | `/api/admin` (stats, reports, centers, officers, users) | Admin |

## Project structure

```
farmlink/
├── backend/
│   ├── prisma/          # schema.prisma, seed.js
│   └── src/
│       ├── config/      # prisma, redis
│       ├── controllers/
│       ├── middleware/  # verifyToken, checkRole
│       ├── routes/
│       ├── utils/
│       ├── app.js
│       └── index.js     # HTTP server + Socket.IO
└── frontend/
    └── src/
        ├── pages/       # Auth, Farmer, Officer, Admin
        ├── components/
        ├── hooks/       # useQueueSocket
        └── utils/       # socket.js
```

## Run it locally

**Prerequisites:** Node.js 18+, a PostgreSQL database (local, Neon or Supabase), a Redis URL (Upstash free tier works).

```bash
git clone https://github.com/<your-username>/farmlink.git
cd farmlink
```

**Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/farmlink"
JWT_SECRET="any_long_random_string"
REDIS_URL=""
CLIENT_URL="http://localhost:5173"
PORT=3001
```

```bash
npx prisma migrate dev
npm run seed      # creates the Admin, a test center and a test Officer
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL="http://localhost:3001"
```

```bash
npm run dev
```


## Status and roadmap

- [x] Authentication with JWT and role-based access control
- [x] Farmer module: profile, nearby centers, slot booking, bookings
- [x] Officer module: verify, record procurement, approve or reject
- [x] Admin module: centers, officers, users, reports
- [ ] Live queue with Socket.IO and Redis
- [ ] Email and in-app notifications
- [ ] Deployment (Vercel and Render)

## Future scope

- Online payment gateway integration
- SMS notifications for farmers without smartphones
- Photo proof of inspection (Multer and Cloudinary)
- Redis adapter for Socket.IO if the backend runs on multiple servers
- Hindi and regional language support

