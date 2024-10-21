# Professors & Classes Web App

This web application allows professors to manage their classes, sessions, and materials using Firebase Firestore and Firebase Storage. Users can upload syllabi and materials, with the URLs stored in Firestore. The app also includes session management and file upload progress tracking.

## Features

- Display and manage classes for professors.
- Add and manage sessions within each class.
- Upload and store materials and syllabi to Firebase Storage.
- Display downloadable links for uploaded materials.
- Real-time upload progress bar for files.

## Technologies Used

- **React**: Frontend UI library
- **Firebase Firestore**: For storing classes, sessions, and material metadata
- **Firebase Storage**: For storing syllabi and materials, generating public URLs
- **React Router**: For navigation
- **Material-UI / Custom CSS**: For styling components and adding progress indicators

## Prerequisites

1. **Firebase Account**: You need a Firebase project with Firestore and Firebase Storage enabled.
2. **Node.js**: Make sure Node.js is installed on your machine.
3. **npm**: Package manager to install dependencies.

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project and add Firebase to your web app.
3. Enable **Firestore** and **Firebase Storage** in your Firebase project.
4. Update your Firebase Security Rules for Firestore and Storage:

   **Firestore Rules**:
   ```plaintext
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
5. Add firebaseConfig.js into your directory
```
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

```

## Installation 
1. Clone the repository
```
git clone https://github.com/tuanle277/spark-web-server.git
cd spark-web-server
```

2. Install dependency
```
npm install
```
3. Start the development server
```
npm start
```

## File Structure 
```
src/
├── components/
│   ├── Classes.js     // Main component to manage classes and sessions
│   ├── firebaseConfig.js  // Firebase configuration
├── classes.css        // CSS file for styling components
├── App.js             // Main entry point of the app

```

### Classes.js Component
This component manages the flow of displaying, adding, and managing classes, sessions, and materials. Here’s a breakdown:

- Class Display: Shows all classes for a professor.
- Session Management: Allows professors to add and view sessions within each class.
- File Upload: Professors can upload syllabi and session materials. These files are stored in Firebase Storage, and their URLs are saved in Firestore.
- File Listing: Lists the uploaded files with clickable download links.
- Progress Bar: Displays real-time progress for file uploads.

**Key Functions**

- Fetching Classes: Uses Firebase Firestore’s collectionGroup() to fetch all classes for a professor.
- Adding Sessions: Allows adding a session under a class by storing session data in Firestore.
- Uploading Files: Handles file uploads to Firebase Storage with real-time progress tracking. The uploaded file URLs are saved in Firestore under the material_url.
- Displaying Files: Uses Firebase Storage’s getDownloadURL() to retrieve the publicly accessible URL for uploaded files and displays them as links



