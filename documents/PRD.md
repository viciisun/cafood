# Project Requirement Document

## Overview

### Project Attributes

- **App Name:** CaFood

- **Target Users:** City Hustlers

- **Target Platform:** Mobile-First Progressive Web App

### Project Description

The project is a food recommendation platform, which enables users to share and rate the shops and dishes. What's more, users can also use the App to help them to decide what to get for the next meal.

### Project Goals

The project aims to create a food recommendation community which is purely based on the user's own experience. Excluding the commercial ads and the paid reviews.

Ultimately, the project aims to provide a platform for metropolitan city hustlers to share their own food experience and to help them to decide what to get for the next meal.

### Features

#### 1. User Management

- **User Registration:** Users can register an account using their email or phone number.

- **User Login:** Users can log in to their account using their email or phone number.

- **User Logout:** Users can log out of their account.

- **User Profile:** Users can view and edit their profile information.

- **User Authentication:** Users can authenticate their account using their email or phone number.

#### 2. Shop Management (Need Approval)

- **Add a Shop:** Users can add a shop to the platform.

  - the shop information should include:
    - **shop name**
    - **shop location**: address, which foodcourt it is located in
    - **shop type**: restaurant, cafe, etc.
    - shop description
    - cuisine type: Chinese, Japanese, Korean, etc.
    - **shop image**: initial image is required, and the image can be changed later.

- **Edit a Shop:** Users can edit the information of a shop.

- **Delete a Shop:** Users can report a discontinued shop, and eventually the shop will be removed from the platform after verification.

- **Shop Rating:** A calculated rating score based on the reviews of the shop.
  - the rating score is calculated comprehensively based on the following criteria:
    - **shop rating score**: 1-5
    - **shop rating count**: the number of reviews
    - **shop rating time**: the time of the review
    - **dish rating score**: 1-5
    - **dish rating count**: the number of reviews
    - **dish rating time**: the time of the review
    - **review approval rate**: the approval rate of the reviews will affect the weight of that review and its rating scores
- **Claim a Shop:** Users can claim to be the shop owner by providing detailed evidence.
  - Then the shop owner can edit the shop information or dish information without further approval.
  - The shop owner can not delete any reviews or photos.
  - The shop owner can edit the displayed shop image.

#### 3. Dishes Management (Need Approval)

- **Add a Dish:** Users can add a dish to a shop.

- **Edit a Dish:** Users can edit the information of a dish.

- **Delete a Dish:** Users can delete a dish.

#### 4. Review Management

User can only add a review to a shop when they have been to the shop.(use geolocation or verify photos)

- **Add a Review:** Users can add a review to a shop or a dish.

  - the content of the review could include:
    - review content: the content of the review
    - **Shop Rating**: 1-5
      - user can add a photo of the shop
    - **Dish Rating**: 1-5
      - user can add a photo of the dish
      - user can add a comment on the dish

- **Edit a Review:** Users can edit the information of their own review.

- **Delete a Review:** Users can delete their own review.

- **Review approval:** Users can like or dislike a review.

- **Review Comment:** Users can comment on a review.

- **Review Reply:** Users can reply to a comment.
