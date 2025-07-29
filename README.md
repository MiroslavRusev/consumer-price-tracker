# Consumer Price Analysis Tool

A modern web application for tracking and analyzing consumer prices in the Bulgarian market. Built with SvelteKit, TypeScript, and Chart.js, this tool provides comprehensive price analysis across food, fuel, and utility categories.

## Features

- **Multi-category Price Tracking**: Monitor food, fuel, and utility prices with interactive charts
- **Real-time Data Integration**: Fetches live data from Eurostat API for food prices and Fuelo API for fuel prices
- **Flexible Time Ranges**: Analyze price trends from 3 months to 10 years
- **Purchasing Power Calculator**: Calculate how price changes affect your budget and purchasing power
- **Bulgarian Market Focus**: Specialized for Bulgarian market analysis with Bulgarian language interface
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Fast Performance**: Lightweight SvelteKit application with optimized data fetching

## Data Sources

- **Food Prices**: [Eurostat HICP (Harmonised Index of Consumer Prices)](https://ec.europa.eu/eurostat/databrowser/view/prc_fsc_idx/default/table?lang=en&category=prc.prc_oth) - Base year 2015=100
- **Fuel Prices**: [Fuelo.net API](https://fuelo.net/) for current fuel pricing data
- **Utility Prices**: Eurostat electricity data with integrated water pricing

## Tracked Items

### Food Items

- Bread, Pork, Poultry, Milk, Eggs, Cooking Oil, Butter, Potatoes, Sugar

### Fuel Types

- Gasoline, Diesel, LPG, Methane

### Utilities

- Electricity, Water

## Tech Stack

- **Frontend**: SvelteKit 5, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Charts**: Chart.js with svelte5-chartjs integration
- **APIs**: Custom SvelteKit API routes for data processing
- **Build Tool**: Vite
- **Package Manager**: Yarn

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager

### Environment Variables

Create a `.env` file with the following variables:

```env
BASE_API_URL_FOOD=https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_fsc_idx?coicop
BASE_API_URL_ELE=https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_pc_204
FUELO_API_URL=https://api.fuelo.net
FUELO_API_KEY=your_fuelo_api_key
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd svetle
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn check` - Type check the project
- `yarn lint` - Run ESLint and Prettier
- `yarn format` - Format code with Prettier

## Project Structure

```
src/
├── components/              # Reusable Svelte components
│   ├── chart.svelte        # Food price charts
│   ├── fuelBarChart.svelte # Fuel price comparison
│   ├── utilityChart.svelte # Utility price charts
│   ├── dataRange.svelte    # Time range selector
│   ├── foodItems.svelte    # Food item selector
│   ├── fuelItems.svelte    # Fuel type selector
│   ├── utilityItems.svelte # Utility selector
│   ├── Form.svelte         # Purchasing power calculator
│   ├── Header.svelte       # Application header
│   └── Footer.svelte       # Application footer
├── lib/                    # Core business logic
│   ├── constants.ts        # Data definitions and mappings
│   ├── interfaces.ts       # TypeScript type definitions
│   ├── stores.ts          # Svelte stores for state management
│   ├── foodDataFetcher.ts  # Food price data processing
│   ├── fuelDataFetcher.ts  # Fuel price data processing
│   ├── utilityDataFetcher.ts # Utility data processing
│   ├── dataProcessing.ts   # Eurostat data transformation
│   ├── dataElectricityProcessing.ts # Electricity data processing
│   ├── dataWaterProcessing.ts # Water price processing
│   └── utils/              # Helper utilities
├── routes/                 # SvelteKit pages and API routes
│   ├── +page.svelte       # Main application page
│   └── api/               # Backend API endpoints
│       ├── food-prices/   # Food price data endpoint
│       ├── fuel-prices/   # Fuel price data endpoint
│       ├── utility-prices/ # Utility price data endpoint
│       └── calculate-pp-change/ # Purchasing power calculator
└── styles/                # Global styles and Tailwind configuration
```

## Features in Detail

### Price Analysis

- Interactive charts showing price trends over selected time periods
- Multi-item comparison with color-coded data series
- Support for both absolute values and percentage changes

### Purchasing Power Calculator

- Input your income and expenses to see how inflation affects your purchasing power
- Compare historical vs. current budget requirements
- Factor in actual price changes across all tracked categories

### Data Processing

- Automatic data transformation from Eurostat's complex JSON structure
- Real-time fuel price integration from Fuelo API
- Caching mechanisms for improved performance

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
