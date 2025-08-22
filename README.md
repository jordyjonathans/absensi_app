# Absensi App

<p>
  Created by Jordy Jonathan Sjarif
</p>
<br>

# Features

- React.js
- Drizzle ORM
- Node.js
- RabbitMQ
- MySQL
- MongoDB
  
# Getting Started
## Backend
```bash
cd backend
npm install
npm run build
npm run start
```


## Consumer
```bash
cd consumer
npm install
npm run build
npm run start
```


## Frontend

```bash
cd frontend2
npm install
npm run start
```


## Docker Setup
MySQL
```bash
docker pull mysql8
docker run -d --name mysql8 -p 3306:3306 -e MYSQL_ROOT_PASSWORD= -e MYSQL_ALLOW_EMPTY_PASSWORD=yes mysql:8
```

MongoDB
```bash
docker pull mongodb6.0
docker run -d --name mongodb6.0 -p 27017:27017 mongo:6.0
```

RabbitMQ
```bash
docker pull rabbitmq:3-management
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```


## Database Setup (Drizzle)
first, you have to create the database first
```bash
CREATE DATABASE absensi_app;
```

second, run this command
```bash
cd backend
npx drizzle-kit push
```


## Seed default data
```bash
cd backend
npx tsx src/db/seeder/ts
```




# Screenshot
![Login Page](https://github.com/user-attachments/assets/9ac5e824-2c0c-4600-b9d5-37dbffae1d48)
![Staff dashboard](https://github.com/user-attachments/assets/295d9919-202a-49b1-b414-835e10c7a96d)
![admin dashboard](https://github.com/user-attachments/assets/966d30e2-a882-4dda-a41a-610109536226)
![admin update profile](https://github.com/user-attachments/assets/1c0827f6-f929-47f6-b30b-92e1e4a9c4f1)
