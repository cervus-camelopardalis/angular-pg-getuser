## Connect Dashboard component with PostgreSQL

Get user data when a user signs in.

*Note 1: Added `max-width` (see `header.component.html` & `header.component.scss`, `app.component.html` & `app.component.scss`, `footer.component.html` & `footer.component.scss`)*

*Note 2: Added router fade animation (see `styles.scss`)*

---

## Setup

1. Clone the repo: `git clone https://github.com/cervus-camelopardalis/angular-pg-getuser.git`
2. Create PostgreSQL database (see `database.sql` file)
3. Insert your database user and password (edit `db.js` file)
4. Install Express modules: `C:\Users\xxxxx\xxxxx\xxxxx\express-server>npm i`
5. Install Angular modules: `C:\Users\xxxxx\xxxxx\xxxxx\angular-client>npm i`
6. Start Express server: `C:\Users\xxxxx\xxxxx\xxxxx\express-server>nodemon server`
7. Run Angular app: `C:\Users\xxxxx\xxxxx\xxxxx\angular-client>ng serve -o`

---

## Screenshots

1. Sign up (test API via Thunder Client):

![Sign up](https://github.com/cervus-camelopardalis/angular-pg-getuser/blob/main/01-screenshot-sign-up.gif)

2. Sign in (test API via Thunder Client):

![Sign in](https://github.com/cervus-camelopardalis/angular-pg-getuser/blob/main/02-screenshot-sign-in.gif)

3. Get user (test API via Thunder Client):

![Get user](https://github.com/cervus-camelopardalis/angular-pg-getuser/blob/main/03-screenshot-get-user.gif)