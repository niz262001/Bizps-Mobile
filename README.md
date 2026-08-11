# BizPS Mobile v1

A complete React Native + Expo mobile application for managing business operations (trips, products, orders, inventory, finance, reports, and shipping).

## Features

- Dashboard with KPIs, daily summaries, and order status overview
- Trips management with products, orders, and buy list flow
- Inventory tracking with expandable size variants and stock alerts
- Finance tracking for capital, cash, bank, and expenses
- Reporting with P&L, sales, expense, trip, and inventory modules
- Shipping label generation placeholder (EasyParcel-like experience)

## Tech Stack

- Expo SDK 57
- Expo Router
- React Native
- TypeScript
- Lucide React Native
- React Native StyleSheet

## Getting Started

```bash
npm install --legacy-peer-deps
npm start
```

## Project Structure

- app/ — Expo Router screens and navigation
- app/(tabs)/ — Main bottom tab screens
- app/trip/ — Trip detail stack screens
- app/shipping/ — Shipping flow screens
- components/ — Shared UI components
- mockData.ts — Mock data and TypeScript interfaces
- theme.ts — Design tokens for the app

