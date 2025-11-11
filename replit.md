# Ray's Art Portfolio Website

## Overview

This is a personal art portfolio website for Ray, a Japanese-American artist and animator. The site showcases their 2D illustrations and 3D models, provides commission information, and serves as a central hub for their online presence. Built as a single-page application with a cute, whimsical aesthetic featuring pastel colors and interactive sparkle effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single-Page Application (SPA) Pattern**
- The website uses a client-side routing system implemented in vanilla JavaScript
- All content sections (home, commissions, 2D gallery, 3D gallery, links) exist as hidden pages in a single HTML document
- Navigation is handled through JavaScript event listeners that toggle CSS classes to show/hide sections
- **Rationale**: Provides instant page transitions without server requests, creating a smooth user experience while keeping the codebase simple for a portfolio site
- **Pros**: Fast navigation, no page reloads, simple to maintain
- **Cons**: All content loads upfront (may impact initial load time if galleries are large)

**CSS Custom Properties for Theming**
- Color palette and design tokens are managed through CSS variables in the `:root` selector
- Includes pastel colors (pink, purple, blue, yellow, green) for the whimsical aesthetic
- **Rationale**: Centralizes theme management, making it easy to adjust colors consistently across the entire site
- **Pros**: Easy theme updates, consistent styling, readable code
- **Cons**: Limited browser support for very old browsers (not a concern for modern portfolios)

**Interactive Sparkle Effects**
- Mouse-tracking sparkle animation system using dynamically created DOM elements
- Throttled to create sparkles every 50ms to balance visual appeal with performance
- **Rationale**: Enhances the cute, magical aesthetic that aligns with the artist's brand
- **Pros**: Engaging user experience, memorable visual identity
- **Cons**: May impact performance on low-end devices, requires JavaScript enabled

### Frontend Technology Stack

**Pure HTML/CSS/JavaScript (No Framework)**
- No build tools, bundlers, or frontend frameworks used
- Direct DOM manipulation for interactivity
- **Rationale**: Simple portfolio site doesn't require framework overhead; vanilla approach ensures fast load times and easy deployment
- **Alternatives Considered**: React/Vue could provide better state management for complex galleries, but adds unnecessary complexity
- **Pros**: Zero dependencies, instant deployment, minimal file size, no build step
- **Cons**: Manual DOM manipulation can become unwieldy if site grows significantly in complexity

**Font Strategy**
- Google Fonts integration for custom typography (Comic Neue, Fredoka, Quicksand)
- Multiple font weights loaded for design flexibility
- **Rationale**: Achieves the friendly, approachable aesthetic appropriate for an art portfolio
- **Pros**: Professional typography, web-safe font delivery
- **Cons**: External dependency, slight performance impact from additional HTTP requests

### Layout Architecture

**Fixed Navigation Pattern**
- Persistent navigation bar at the top of the page
- Active state management shows current section
- **Rationale**: Provides constant access to all sections without scrolling, essential for SPA navigation
- **Pros**: Always accessible, clear visual feedback on current location
- **Cons**: Reduces vertical space on mobile devices

**Content Organization**
- Sections structured as separate page divs with show/hide toggle
- Each section includes consistent header styling with decorative elements
- **Rationale**: Modular content structure makes it easy to add/remove sections and maintain consistent layout
- **Pros**: Easy to update individual sections, consistent user experience
- **Cons**: All HTML must be loaded upfront

### Visual Design System

**Gradient-Based Backgrounds**
- Multiple layered radial gradients create depth and visual interest
- Fixed attachment ensures background stays in place during scrolling
- **Rationale**: Creates a dreamy, artistic atmosphere that complements the portfolio content
- **Pros**: Visually striking, no image assets needed, scales perfectly
- **Cons**: CSS-only, limited design flexibility compared to image backgrounds

**Responsive Image Handling**
- External image hosting (Tumblr CDN) for portfolio artwork
- **Rationale**: Offloads image storage and delivery to existing platform
- **Pros**: No local storage needed, leverages CDN
- **Cons**: Dependency on external service, potential for broken links

## External Dependencies

### Third-Party Services

**Google Fonts**
- Purpose: Custom typography (Comic Neue, Fredoka, Quicksand font families)
- Integration: CSS import at stylesheet level
- Fallback: Generic sans-serif fonts

**Tumblr CDN**
- Purpose: Image hosting for profile pictures and artwork
- Integration: Direct image URLs in HTML img tags
- Dependency: Site requires Tumblr service availability for images to display

**Ko-Fi**
- Purpose: Artist support/donation platform
- Integration: External links for monetization support
- Type: Reference only (no embedded widgets visible in provided code)

### External Links
- Ko-Fi profile (https://ko-fi.com/azurazar) for financial support
- Additional social/portfolio links likely in the "Links" section (not fully visible in provided code)