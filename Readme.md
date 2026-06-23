# TajikistanHotels

## Enterprise Hotel Aggregator Platform for Tajikistan

---

# Project Overview

TajikistanHotels is a hotel search, comparison, recommendation and booking platform focused on hotels across Tajikistan.

The platform combines:

* Hotel Search
* Hotel Comparison
* Reviews
* Favorites
* Booking Management
* AI Travel Assistant
* Hotel Owner Dashboard
* Analytics
* Interactive Maps

---

# Architecture

The system consists of two independent applications.

## Frontend

Technology Stack:

* React 19
* TypeScript
* Vite
* TailwindCSS
* React Router
* TanStack Query
* Zustand
* React Hook Form
* Zod
* Axios
* Framer Motion
* i18next
* Leaflet Maps

Purpose:

* User Interface
* Hotel Search
* AI Assistant UI
* Booking UI
* Reviews
* Favorites
* Admin Dashboard

---

## Backend

Technology Stack:

* ASP.NET Core 9 Web API
* C#
* Clean Architecture
* CQRS
* MediatR
* Entity Framework Core
* PostgreSQL
* FluentValidation
* AutoMapper
* JWT Authentication
* Refresh Tokens
* Serilog
* Redis
* OpenAI Integration
* Docker

Purpose:

* Business Logic
* Authentication
* Hotel Management
* Booking Engine
* AI Processing
* Analytics
* Reporting

---

# Clean Architecture Structure

src/

* TajikistanHotels.API
* TajikistanHotels.Application
* TajikistanHotels.Domain
* TajikistanHotels.Infrastructure
* TajikistanHotels.Persistence

tests/

* TajikistanHotels.UnitTests
* TajikistanHotels.IntegrationTests

---

# Domain Modules

## Authentication

Features:

* Login
* Register
* Refresh Token
* Logout
* Forgot Password
* Email Verification

---

## Hotel Module

Features:

* Add Hotel
* Update Hotel
* Delete Hotel
* Hotel Details
* Hotel Gallery
* Hotel Amenities
* Hotel Statistics

---

## Room Module

Features:

* Room Types
* Room Availability
* Room Pricing
* Room Capacity

---

## Booking Module

Features:

* Create Booking
* Cancel Booking
* Confirm Booking
* Booking History

---

## Review Module

Features:

* Add Review
* Edit Review
* Delete Review
* Hotel Ratings

---

## Favorite Module

Features:

* Save Hotel
* Remove Hotel
* User Wishlist

---

## Menu Module

Features:

* Restaurant Menu
* Categories
* Food Pricing

---

## Analytics Module

Features:

* Hotel Views
* Bookings Count
* Revenue Reports
* Occupancy Reports

---

## AI Assistant Module

Features:

* Hotel Recommendation
* Budget Recommendation
* Family Recommendation
* Luxury Recommendation
* Travel Planning
* City Guide
* Hotel Comparison

---

# Frontend Pages

## Public Pages

* Home
* Hotels
* Hotel Details
* Cities
* Search Results
* Compare Hotels
* AI Assistant
* Login
* Register

---

## User Pages

* Profile
* My Bookings
* Favorites
* Reviews

---

## Hotel Owner Pages

* Dashboard
* My Hotels
* Rooms
* Bookings
* Analytics
* Reviews

---

## Admin Pages

* Dashboard
* Hotels Management
* Users Management
* Owners Management
* Reviews Moderation
* Statistics

---

# Database Modules

Tables:

* Users
* Roles
* RefreshTokens
* Hotels
* HotelPhotos
* Amenities
* HotelAmenities
* Rooms
* Bookings
* BookingGuests
* Reviews
* Favorites
* Menus
* MenuCategories
* HotelPolicies
* HotelViews
* HotelStatistics
* Notifications
* ContactRequests
* AIConversations
* AIChatMessages
* Cities
* AuditLogs

Expected:

25-35 tables

---

# AI Assistant

Examples:

User:

Find me a cheap hotel in Dushanbe for 3 nights

AI:

* Search database
* Find matching hotels
* Calculate total stay
* Return recommendations

---

User:

I have $300 for one week

AI:

* Calculate possible stays
* Rank hotels by value
* Return best options

---

User:

Luxury hotel with pool and gym

AI:

* Filter hotels
* Sort by rating
* Return best matches

---

# Maps

Leaflet + OpenStreetMap

Features:

* Hotel Markers
* Hotel Clustering
* Route Directions
* Nearby Hotels

---

# Security

* JWT
* Refresh Tokens
* Role Based Access
* Rate Limiting
* Audit Logging
* Email Verification
* Password Reset

---

# Infrastructure

* PostgreSQL
* Redis
* OpenAI
* Cloudinary
* Docker
* GitHub Actions

---

# Deployment

Frontend:

* Vercel

Backend:

* Railway
* Render
* Azure App Service

Database:

* PostgreSQL
* Neon
* Supabase

Storage:

* Cloudinary

---

# Future Features

Phase 2

* Real Payments
* Stripe
* PayPal
* Tajik Payment Providers
* Mobile Application
* Push Notifications
* Telegram Bot
* Recommendation Engine
* Machine Learning Analytics

---

# Estimated Size

Frontend:

* 50+ Components
* 20+ Pages

Backend:

* 100+ API Endpoints
* 30+ Database Tables
* 10+ Modules

Difficulty:

Senior Full Stack Developer
Enterprise Level Project
Startup Ready MVP

# 🏨 TajikistanHotels

## Overview

TajikistanHotels is a modern hotel booking and travel platform designed specifically for Tajikistan.

The platform allows users to search hotels, book rooms, manage reservations, explore tourist destinations, purchase travel packages, and interact with an AI travel assistant.

The goal is to create the first enterprise-grade hotel ecosystem for Tajikistan comparable to Booking.com, Airbnb, and Expedia.

---

# Vision

Build the largest hotel and tourism platform in Tajikistan.

Provide:

* Hotel booking
* Apartment rental
* Tour booking
* Travel recommendations
* AI travel assistant
* Online payments
* Hotel management system
* Analytics dashboard

---

# Core Features

## Guest Features

### Authentication

* Register
* Login
* JWT Authentication
* Google Login
* Email Verification
* Password Recovery

### Hotel Search

* Search by city
* Search by hotel name
* Search by rating
* Search by price
* Search by amenities
* Search by room type

### Booking System

* Reserve rooms
* Cancel reservation
* Modify reservation
* Booking history
* Booking status tracking

### Reviews

* Create review
* Edit review
* Delete review
* Hotel ratings

### Favorites

* Save hotels
* Remove hotels
* Personal wishlist

### Notifications

* Booking updates
* Promotions
* Email notifications
* Push notifications

---

# Hotel Owner Features

## Hotel Management

* Create hotel
* Update hotel
* Delete hotel
* Manage hotel images
* Hotel approval workflow

## Room Management

* Create room
* Update room
* Delete room
* Room pricing
* Room availability

## Reservation Management

* View reservations
* Approve bookings
* Reject bookings
* Check-in
* Check-out

## Analytics

* Revenue reports
* Occupancy reports
* Reservation reports
* Customer statistics

---

# Admin Features

## User Management

* Manage users
* Block users
* Manage roles
* Permission management

## Hotel Moderation

* Approve hotels
* Reject hotels
* Manage hotel content

## Review Moderation

* Delete inappropriate reviews
* Manage reports

## Analytics

* Total bookings
* Revenue
* Hotel statistics
* User activity

---

# AI Travel Assistant

## Features

### Hotel Recommendations

Example:

User:
Find a hotel in Dushanbe under $50

AI:
Recommended hotels:

* Hilton Dushanbe
* Atlas Hotel
* Serena Hotel

### Travel Planner

Example:

User:
Plan a 3-day trip to Dushanbe

AI:
Creates full itinerary

### Translator

Supported Languages:

* Tajik
* Russian
* English

### Travel Advisor

* Best restaurants
* Tourist attractions
* Weather information
* Transportation advice

---

# Frontend Architecture

## Technologies

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Shadcn/UI
* Redux Toolkit
* React Query
* React Hook Form
* Zod
* Axios

## Frontend Structure

src/

├── app/

├── components/

├── pages/

├── layouts/

├── services/

├── hooks/

├── features/

├── store/

├── routes/

├── types/

├── assets/

└── utils/

---

# Backend Architecture

## Technologies

* .NET 9
* ASP.NET Core Web API
* Entity Framework Core
* PostgreSQL
* Redis
* MediatR
* CQRS
* FluentValidation
* AutoMapper
* Serilog
* Identity
* JWT

---

# Clean Architecture

TajikistanHotels/

├── Domain

├── Application

├── Infrastructure

├── Persistence

├── WebAPI

├── Shared

└── Tests

---

# Domain Layer

Contains:

* Entities
* Value Objects
* Domain Events
* Enumerations

Entities:

* User
* Hotel
* Room
* Reservation
* Review
* Tour
* Payment
* Notification

---

# Application Layer

Contains:

* CQRS Commands
* CQRS Queries
* DTOs
* Validators
* Interfaces
* Business Rules

---

# Infrastructure Layer

Contains:

* External Services
* Email Service
* Payment Gateway
* AI Integration
* File Storage

---

# Database

PostgreSQL

Tables:

* Users
* Roles
* Hotels
* Rooms
* Reservations
* Reviews
* Payments
* Tours
* Notifications

---

# API Modules

## Authentication Module

/api/auth

## Hotel Module

/api/hotels

## Room Module

/api/rooms

## Reservation Module

/api/reservations

## Review Module

/api/reviews

## Payment Module

/ api/payments

## AI Module

/api/ai

---

# Dashboard Structure

## Customer Dashboard

* Profile
* My Bookings
* Favorites
* Reviews
* Wallet
* Settings

## Hotel Dashboard

* Overview
* Hotels
* Rooms
* Reservations
* Reports
* Employees

## Admin Dashboard

* Users
* Hotels
* Reviews
* Payments
* Analytics
* Settings

---

# Security

* JWT Authentication
* Refresh Tokens
* Role Based Authorization
* API Rate Limiting
* SQL Injection Protection
* XSS Protection
* HTTPS
* Data Encryption

---

# DevOps

## Docker

* Dockerfile
* Docker Compose

## CI/CD

GitHub Actions

Pipeline:

* Build
* Test
* Publish
* Deploy

---

# Monitoring

* Serilog
* Seq
* OpenTelemetry
* Health Checks

---

# Future Features

* Mobile Application
* AI Chatbot
* AI Travel Planner
* Dynamic Pricing
* Loyalty Program
* Multi-Currency Support
* Flight Booking
* Car Rental
* Travel Insurance

---

# UI Pages

## Public Pages

* Home
* Hotels
* Hotel Details
* Tours
* About
* Contact

## Auth Pages

* Login
* Register
* Forgot Password

## Dashboard Pages

* Profile
* Reservations
* Favorites
* Reviews

## Admin Pages

* Users
* Hotels
* Reports
* Analytics

---

# Design Inspiration

Booking.com

Airbnb

Expedia

Agoda

Stripe Dashboard

Linear App

Vercel Dashboard

---

# Project Goal

Create a production-ready enterprise travel ecosystem for Tajikistan capable of serving thousands of hotels, tourists, and businesses while providing a modern AI-powered booking experience.
