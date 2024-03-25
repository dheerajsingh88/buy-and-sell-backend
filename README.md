# Buy and Sell React Application

This is a Node backend application for buying and selling items.

## Backend Database Tables

### Listings Table

- **id**: VARCHAR(36) - Primary key. Unique identifier for each listing.
- **name**: VARCHAR(45) - Name of the listing.
- **description**: VARCHAR(1000) - Description of the listing.
- **price**: DECIMAL(10,2) - Price of the listing.
- **user_id**: VARCHAR(45) - User ID associated with the listing.
- **views**: INT - Number of views for the listing.

### User Table

- **id**: VARCHAR(45) - Primary key. Unique identifier for each user.
- **email**: VARCHAR(45) - Email address of the user.
- **password**: VARCHAR(200) - Password of the user (hashed or encrypted).

## Getting Started

To run the application locally, follow these steps:

1. Clone this repository.
2. Install dependencies: npm install
3. Start the backend server: npm run start

   5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please create a GitHub issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

