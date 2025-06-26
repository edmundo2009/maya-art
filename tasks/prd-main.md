## PRD: "Maya Lama" Immersive Artwork Portfolio

*   **Vision:** A minimalist, elegant, and highly performant web portfolio that presents Maya Lama's artwork as an immersive, uninterrupted visual experience. The design prioritizes the art itself, using subtle UI and fluid navigation to create a digital gallery that feels both modern and timeless.

---

### 1. Core Principles & Philosophy

*   **Visuals First:** The artwork is the hero. Every design decision must serve to enhance the presentation of the images, not distract from them.
*   **Minimalism & Elegance:** The UI should be almost invisible, appearing only when needed. We will use clean lines, generous white space, a limited color palette (monochromatic), and refined typography.
*   **Immersive Experience:** From the moment a user lands on the site, they should feel like they are in a private gallery. Full-screen views and seamless transitions are key to this.
*   **Instant Performance:** The site must feel instantaneous. We will use modern web technologies, specifically Next.js's image optimization and preloading strategies, to eliminate perceived loading times.

---

### 2. Functional Requirements

#### 2.1. Homepage / Thematic Grid

This is the main entry point of the website. It must be a full-page, pixel-perfect implementation of the provided mockup "main_page.png".

refer to: prd-2.1-Homepage.md

#### 2.2. Artwork Viewer Page

This page is activated when a user clicks a thumbnail. It is a full-screen, horizontal gallery.

*   **Layout:**
    *   The page is a full-viewport, edge-to-edge container for the horizontal artwork without any cropping of the artwork. Same with vertical artworkk, full artwork should be displayed w/o cropping and if the ratio do not match then the image should be centered and the background should be white.
    *   There is no visible padding or margin on either top bottom or left right.
    *   Users scroll horizontally to navigate between images within the selected category.
*   **Image Loading & Performance:**
    *   **This is critical:** The transition between images must be instantaneous.
    *   To achieve this, the application must **preload** the next and previous images. When the user is viewing `Image N`, the browser should be fetching `Image N-1` and `Image N+1` in the background.
    *   Use the Next.js `<Image>` component for all artwork, leveraging its priority loading and optimization features.
*   **Navigation:**
    *   **Arrow Icons:**
        *   Use simple, elegant arrow icons (e.g., from `lucide-react`).
        *   A right arrow appears on the right edge of the screen.
        *   A left arrow appears on the left edge of the screen.
        *   **Visibility Logic:**
            *   On the first image of a series, only the right arrow is visible.
            *   On the last image of a series, only the left arrow is visible.
            *   On all other images, both arrows are visible.
        *   The arrows should have a subtle background or drop shadow to ensure they are visible against any artwork.
    *   **Keyboard Navigation:**
        *   The user must be able to navigate using the `ArrowLeft` and `ArrowRight` keyboard keys. This should trigger the same instantaneous image change as clicking the on-screen arrows.

#### 2.3. On-Screen UI (Heads-Up Display)

This UI is overlaid on the Artwork Viewer page and must be subtle.

*   **"HOME" Link:**
    *   **Text:** "HOME" same font as -> DISCARDED "mainpage MAYA LAMA" title.
    *   **Position:** Fixed to the top-left corner of the viewport, with clean padding (e.g., `p-4` or `p-6`).
    *   **Functionality:** Clicking this text navigates the user back to the Homepage.
    *   **Styling:** Use the same font as "THEMES". It should have a very subtle, semi-transparent background on hover to lift it from the image without looking like a heavy button.


*   **Category Display / Navigation Menu:**
    *   **Text:**  Use the same font as "mainpage thumbnail text".
    *   **Styling:** Same as HOME link. It should have a very subtle, semi-transparent background on hover, ditto to the HOME link. #TODO Update Nav link: text-black/90 with hover:bg-black/10 to work with white background:


    *   **Position:** Fixed to the top-right corner of the viewport, with the same padding as the "HOME" link.
    *   **Default State:** Displays the name of the current category (e.g., "ARTIST MONOLOGUES").
    *   **Hover State (This requires animation):**
        *   When the user's mouse hovers over the category name, it should smoothly expand downwards into a vertical list.

        *   When the user's mouse hovers over the category name, it should smoothly expand downwards into a vertical list.
        *   This list contains clickable links to the **other three** artwork categories.
        *   The animation should be subtle, using Framer Motion to control `opacity` and `height`/`y-position`.
    *   **Mouse-Out State:** When the mouse leaves the expanded menu area, it should smoothly animate back to its collapsed, default state (showing only the current category name).

---

### 3. Data & Asset Structure

*   **Folder Structure:** All artwork will be stored locally in the project. The developer must create this exact folder structure:
    ```
    public/
    └── artwork/
        ├── ARTIST MONOLOGUES/
        │   ├── 01.jpg/png
        │   └── 02.jpg
        ├── QUEST FOR INFINITY/
        │   ├── 01.jpg
        │   └── 02.jpg
        ├── BUBBLE MOON/
        │   ├── 01.jpg
        │   └── 02.jpg
        └── WEATHER REPORT/
            ├── 01.jpg
            └── 02.jpg
    ```
*   **Image Optimization:** **All images must be optimized for the web before being placed in these folders.** They should be resized to a reasonable maximum width (e.g., 1920px) and compressed to be under 500 KB, ideally closer to 300 KB.
*   **Data Fetching:** The Next.js application will read the contents of these directories at build time (`getStaticProps` or similar server-side logic) to generate the pages and galleries. This ensures the site is fully static and incredibly fast.

---

### 4. Non-Functional Requirements

*   **Responsiveness:**
    *   The site must be fully responsive and functional on desktop, tablet, and mobile.
    *   On smaller screens (tablet/mobile), the 4-thumbnail grid on the homepage should stack vertically (e.g., a 2x2 grid or a 1x4 column).
*   **Performance:** A Google Lighthouse score of 95+ for Performance is the target.
*   **Accessibility (a11y):**
    *   All interactive elements (thumbnails, arrows, links) must be keyboard-accessible and have clear focus states.
    *   All artwork images must have descriptive `alt` text (e.g., "Artwork from the Artist Monologues series, number 1 of 5"). This can be generated from the file name.

---

### 5. Technology Stack

*   **Framework:** Next.js (starting fresh, no template)
*   **Styling:** Tailwind CSS
*   **Animation:** Framer Motion
*   **Icons:** `lucide-react`
*   **Deployment:** Vercel

---

### 6. Out of Scope for Version 1.0

*   No database or CMS. Content is managed via files in the `public` folder.
*   No "About" or "Contact" pages. The UI is limited to the Homepage and the Artwork Viewer.
*   No complex page transition effects (the focus is on instantaneous image loading).
*   No light/dark mode toggle. The aesthetic is fixed.

---
