# Chat App

A BookStore app based on React(Typescript oriented using ViteJS), XState(State Management), ExpressJS(Server), NodeJS(Backend), MongoDB(Database) and graphQL.

## **To get it running locally**

---

- Setup the code
- Install dependencies
- Run application

### **Code setup:**

1. **Set up nodemon.json file:**

```
MONGO_USER="your mongoDB username"
MONGO_PASSWORD="your mongoDB password"
MONGO_DB="your mongoDB database name"
```

2. **Install Dependencies:**

### In root directory

```
npm install
```

### and plus in frontend directory

```
cd frontend/
npm install
```

<br>

### **Build: frontend**

To build the frontend application use the below command on your terminal/shell in root directory.

```
cd frontend/
npm run build
```

#### **Or**

Directly build command if you are in frontend directory.

```
npm run build
```

<br>

### **Run:**

To start running the application on browser we have to start backend and frontend seprately.

#### **Backend first**

run start command in root directory in one terminal

```
npm start
```

And then it will be running on http://localhost:3000

And our backend server is ready.

You will get `DATABASE CONNECTED` once database is connected.

#### **Frontend now**

run dev command in frontend directory in another terminal to run in developer's mode

#### if you are in root directory

```
cd frontend/
npm run dev
```

if you are in frontend directory

```
npm run dev
```

and the development mode app can be accessed on http://localhost:5173/

#### Or you can preview the builded app from root directory

```
cd frontend/
npm run preview
```

Or you can preview the builded app from frontend directory directly

```
npm run preview
```

and the preview of app can be accessed on http://localhost:4173/
<br>

using node v19.1.0 (npm v8.19.3)

## Have a good experience

<br>
