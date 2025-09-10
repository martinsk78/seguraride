# React Firebase Authentication Project

This project is a simple React application that implements Firebase authentication and includes a basic database connection. It features a login page where users can enter their credentials and a dashboard that displays user information upon successful login.

## Project Structure

```
react-firebase-auth
├── public
│   ├── index.html
│   └── manifest.json
├── src
│   ├── components
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── firebase
│   │   └── config.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── styles
│       └── App.css
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd react-firebase-auth
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Firebase Configuration:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Email/Password authentication in the Authentication section.
   - Copy your Firebase configuration and paste it into `src/firebase/config.ts`.

4. **Run the application:**
   ```bash
   npm start
   ```
   This will start the development server and open the application in your default web browser.

## Usage

- Navigate to the login page to enter your email and password.
- Upon successful login, you will be redirected to the dashboard where you can see your user information.
- You can log out from the dashboard.

## Technologies Used

- React
- Firebase Authentication
- TypeScript
- CSS for styling

## License

This project is licensed under the MIT License.