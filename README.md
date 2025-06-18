# World Tycoon Game

Welcome to the World Tycoon Game! This is a web-based tycoon game where players can choose a starting country in Europe and work to unlock additional countries and continents while managing resources and competing on leaderboards.

## Features

- **Country Selection**: Start with one of three European countries, each with unique buffs that impact your progress.
- **Unlocking Countries**: Progress through the game by unlocking new countries and eventually other continents.
- **Resource Management**: Manage money and population growth, upgrade features, and adjust tax rates to optimize your country's economy.
- **Leaderboards**: Compete with other players by unlocking countries and see how you rank against others.

## Technologies Used

- HTML
- CSS
- JavaScript
- Firebase for authentication and data storage

## Project Structure

```
world-tycoon-game
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── assets
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── game.js
│   │   └── leaderboard.js
│   └── firebase
│       └── config.js
├── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/world-tycoon-game.git
   ```

2. Navigate to the project directory:
   ```
   cd world-tycoon-game
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up Firebase:
   - Create a Firebase project and obtain your configuration settings.
   - Update the `src/firebase/config.js` file with your Firebase credentials.

5. Open `public/index.html` in your browser to start playing!

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.