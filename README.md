# API Documentation

Welcome to the API documentation. This document provides details about the available endpoints, their functionalities, and how to use them.






### Instructions:

1. Make a .env file that contains:
  - PORT=<your_desired_port>
  - DB_NAME="db_app_diet"
  - DB_USERNAME=<your_username>
  - DB_PASSWORD=<your_password>
  - X_APP_ID=<nutritionix_app_id>
  - X_APP_KEY="nutritionix_app_key"
2. Install all dependencies in console with `npm i`

### User Endpoints

#### Create User

- **URL:** `/users`
- **Method:** `POST`
- **Description:** Create a new user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }

