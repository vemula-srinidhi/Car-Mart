## Car Management Application - Support Document

### Overview

This Car Management Application allows users to manage their car listings with functionalities to create, view, edit, and delete cars. Users can upload up to 10 images for each car, and each listing can include a title, description, and tags like car type, company, and dealer. The app also supports user authentication, ensuring that only authenticated users can manage their listings.

### Prerequisites
- **Node.js** and **npm** installed on your system.
- Firebase project set up with Firestore and Authentication enabled.

### 1. Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd car-management-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Go to the Firebase Console, create a project, and enable Firestore and Authentication.
   - Create a Firebase Web App and copy the configuration details.
   - In the project, create a `.env` file and add your Firebase config:
     ```plaintext
     VITE_API_KEY=<your_api_key>
     VITE_AUTH_DOMAIN=<your_auth_domain>
     VITE_PROJECT_ID=<your_project_id>
     VITE_STORAGE_BUCKET=<your_storage_bucket>
     VITE_MESSAGING_SENDER_ID=<your_messaging_sender_id>
     VITE_APP_ID=<your_app_id>
     ```

4. **Run the Application**
   ```bash
   npm run dev
   ```
   - The app should be accessible on `http://localhost:5173`.

---

### 2. Key Functionalities

#### User Authentication

1. **Sign Up / Login**
   - Users can sign up with an email and password or log in if they already have an account.
   - Firebase Authentication handles user management.

2. **Logout**
   - Users can log out using the logout button, clearing their session.

#### Car Management

1. **Add Car**
   - Accessible via the “Add Car” button on the Product List Page.
   - Users can upload up to 10 images, add a title, description, and tags.
   - Data is stored in Firestore, and images are uploaded to Firebase Storage.

2. **View Car List**
   - Shows a list of all cars created by the logged-in user.
   - Users can search for cars using keywords that match title, description, or tags.

3. **Car Details**
   - Clicking on a car from the list displays detailed information about the car, with options to edit or delete it.

4. **Edit Car**
   - Users can edit the car's title, description, tags, or images by clicking “Edit” on the Car Details Page.

5. **Delete Car**
   - Users can delete a car listing. This action removes the car data from Firestore and the images from Firebase Storage.

---

### 3. API Endpoints

1. **Create User**
   - **Purpose**: Registers a new user.
   - **Endpoint**: Handled by Firebase Authentication.

2. **Create Product (Car)**
   - **Purpose**: Adds a new car listing.
   - **Data**: `{ title, description, tags, images }`
   - **Database**: Firestore

3. **List Products (User’s Cars)**
   - **Purpose**: Retrieves all cars added by the logged-in user.

4. **View Car Details**
   - **Purpose**: Fetches detailed information of a specific car.
   - **Data**: `carId` passed to retrieve car details.

5. **Update Product**
   - **Purpose**: Updates car details such as title, description, tags, or images.

6. **Delete Product**
   - **Purpose**: Removes a car listing from Firestore and its images from Firebase Storage.

---

### 4. Frontend Pages

1. **Login / Sign Up Page**
   - Users can register or log in with email and password.

2. **Product List Page**
   - Displays all cars created by the logged-in user.
   - Includes a search bar to filter listings by keywords.

3. **Product Creation Page**
   - Form where users can upload images, set a title, and write a description for a new car listing.

4. **Product Detail Page**
   - Displays detailed information of a specific car, with options to edit or delete.

---

### 5. Technologies Used

- **React (Vite)**: Frontend framework for building the application.
- **Firebase Authentication**: Manages user sign-up, login, and logout.
- **Firestore**: Stores user and car data.
- **Firebase Storage**: Stores images uploaded for each car.
- **Plain CSS**: Styles the user interface for simplicity and clarity.
