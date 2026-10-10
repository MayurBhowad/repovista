# RepoVista User Guide

This guide describes the experience RepoVista is being built to provide. The application shell is in place: a sidebar on wider screens, a header, a menu on smaller screens, and a light/dark theme. The home page introduces the collection, and `/repositories/[name]` says the detail view is coming soon. Search, filters, cards, and case-study sections below are the intended product, not features that work today. Implementation order is in `PLAN.md`.

## What Is RepoVista?

RepoVista is a visual way to explore software projects.

GitHub answers where the code lives. RepoVista answers:

- What is this project?
- Why was it built?
- What does it do?
- What technologies does it use?
- Where can I learn more?

## Moving around

The frame is the same on every page.

- **Sidebar** on wider screens: RepoVista, a short description, and Explore.
- **Header**: the theme control. On smaller screens it also shows the menu and the name.
- **Menu** on smaller screens: the same destinations as the sidebar. Escape or Close menu dismisses it.
- **Theme**: the header control switches light and dark. The first visit follows the device appearance. The choice stays in this browser.

A skip link is the first control when navigating with a keyboard.

## Home

The home page introduces the project collection and highlights selected projects.

Users can:

- Browse featured projects.
- Browse all projects.
- Search projects.
- Filter by category.
- Sort projects.
- Open a project for more details.

## Project Cards

Each project card prioritizes human-friendly information:

- Project name
- Short description
- Category
- Technologies
- Stars
- Forks
- Last updated
- Explore action

Technical GitHub information supports the story. It does not dominate the card.

## Project Detail

A project detail page explains the project as a small case study at `/repositories/[name]`.

Expected sections:

- Overview
- Why it exists
- How it works
- Technologies
- Screenshots
- GitHub information
- Roadmap, when useful

## Search

Search helps users discover projects by:

- Name
- Description
- Technology
- Topic

Search feels immediate because it runs on projects the server has already loaded. It does not call the GitHub API on every keystroke.

A search can be shared with a URL such as `/?search=ai`.

## Filters

Users can filter projects by:

- AI
- Backend
- Frontend
- Database
- DevTools
- Desktop
- Learning

A filter can be shared with a URL such as `/?category=AI` or `/?category=AI&search=document`.

## Accessibility

Users can navigate the application with a keyboard and understand the interface with assistive technologies.

Motion respects reduced-motion preferences.

## Design Principle

RepoVista should always feel like:

> A beautiful project gallery powered by GitHub.

The gallery explains the work. Repository statistics stay available as supporting facts.
