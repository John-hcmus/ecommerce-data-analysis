# Copilot Instructions for ecommerce-data-analysis

## Project Overview
This project analyzes ecommerce sales data to extract insights on revenue, customers, and products. It uses SQL for data storage and querying, and Python (via Jupyter notebooks) for data analysis and visualization.

## Architecture
- **Data Storage**: SQL database with tables for customers, products, orders, and order_items.
- **Data Flow**: Raw data in `data/raw/`, processed via SQL scripts in `sql/`, analyzed in `notebooks/`, reports in `reports/`.
- **Key Components**:
  - `sql/01_schema.sql`: Defines database schema.
  - `sql/02_insert.sql`: Inserts sample data.
  - `sql/03_basic_queries.sql`: Basic analysis queries.
  - `notebooks/`: Jupyter notebooks for Python-based analysis.
  - `reports/`: Output reports and visualizations.

## Workflows
- **Data Setup**: Run SQL scripts in numerical order to set up database and insert data.
- **Analysis**: Use Jupyter notebooks to load data from SQL, perform analysis, and generate reports.
- **Reporting**: Save analysis results and visualizations to `reports/`.

## Conventions
- SQL files are prefixed with numbers (e.g., `01_`, `02_`) to indicate execution order.
- Use Python libraries like pandas, matplotlib, seaborn for data manipulation and visualization in notebooks.
- Store raw data files in `data/raw/` without modification.
- Place analysis outputs in `reports/` with descriptive names.

## Examples
- When adding new analysis, create a new notebook in `notebooks/` and reference SQL queries from `sql/`.
- For database queries, extend `sql/03_basic_queries.sql` with new SELECT statements.