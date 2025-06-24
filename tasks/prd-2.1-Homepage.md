
## PRD Section 2.1 Homepage

### **2.1.0. Design Vision & Core Goal**

The homepage serves as the site's main entry point and must be a pixel-perfect, full-viewport implementation of the provided mockup. The primary goal is to create an immediate sense of refined artistry and minimalist elegance. The developer's focus should be on precise replication of spacing, typography, alignment, and the subtle layering effect.

### **2.1.1. Technical Implementation Strategy: Layering with Negative Margins**

To achieve the required visual overlap where the "MAYA LAMA" title sits above the thumbnail grid, a standard two-column layout is insufficient. The **required implementation strategy** is to use a layered approach.

*   **Conceptual Model:** The layout consists of two primary blocks stacked vertically and then intentionally overlapped.
    1.  **Block 1: The Artist's Name (`<h1>`)**: A standalone text element that establishes the top of the content area. It must have a `z-index` to ensure it renders on top.
    2.  **Block 2: The Content Row (`<div>`)**: A container using Flexbox (`display: flex`) to position the "THEMES" label and the thumbnail grid side-by-side.
*   **The Overlap Mechanism:** Block 2 will be given a **negative top margin** (e.g., `margin-top: -4rem` or `-mt-16` in Tailwind). This pulls the entire Content Row upwards in the document flow, causing it to slide *under* the Artist Name block, creating the intended overlap.
*   **Implementation Note:** This method is superior to `position: absolute` as it maintains a logical document flow, is more robustly responsive, and simplifies vertical alignment using Flexbox utilities like `items-baseline`.

### **2.1.2. Layout Architecture & Spacing**

*   **Viewport & Background:**
    *   Fills the entire viewport (`100vw`, `100vh`) with no scrolling.
    *   Background color: **`#f5f5f5`** (Tailwind: `bg-neutral-100`).
*   **Main Container:**
    *   The entire content should be wrapped in a container that has a `max-width` (e.g., `max-w-7xl`) and is horizontally centered.
    *   This container should have generous padding on all sides (e.g., `p-16` on mobile, `md:p-24` on desktop) to ensure content never touches the screen edges.

### **2.1.3. Component Specifications**

#### **Block 1: Artist Name**

*   **HTML Element:** `<h1>`
*   **Positioning:** Must have `position: relative` and `z-index: 10` to ensure it stays on top of Block 2.
*   **Typography:**
    *   **Font:** Playfair Display (Use `next/font` for performance).
    *   **Weight:** `font-light` (300).
    *   **Size:** `text-6xl` (on desktop, scaled down for smaller viewports).
    *   **Letter Spacing:** `tracking-[0.35em]`.
    *   **Color:** Near-black: **`#1a1a1a`**.

#### **Block 2: The Content Row**

*   **HTML Element:** `<div>`
*   **Layout:** `display: flex`, `justify-content: space-between`.
*   **Vertical Alignment:** **`align-items: baseline`**. This is critical for aligning the "THEMES" text with the top of the image grid.
*   **Positioning:** Apply a negative top margin (e.g., `-mt-16`) to create the overlap with Block 1.

##### **Part A: "THEMES" Label (Child of Block 2)**

*   **HTML Element:** `<h2>` or `<p>`
*   **Typography:**
    *   **Font:** Inter (Use `next/font`).
    *   **Weight:** `font-medium` (500).
    *   **Size:** `text-sm`.
    *   **Letter Spacing:** `tracking-widest`.
    *   **Color:** Medium grey: **`#6b7280`**.

##### **Part B: Thumbnail Grid (Child of Block 2)**

*   **HTML Element:** A `<div>` using `display: grid`.
*   **Grid Configuration:** `grid-cols-4` with a `gap-6`. (This will change on responsive breakpoints).
*   **Thumbnail Component Structure (Design Specification):**
    *   Each thumbnail must be a single, unified component, likely named `<Thumbnail />`.
    *   The root of this component must be a Next.js `<Link href="...">` tag to ensure the entire area is clickable.
    *   Inside the `<Link>`, it should contain:
        1.  A Next.js `<Image />` component.
        2.  A `<div>` for the text overlay.
    *   **Aspect Ratio:** Enforce a strict **`3:4`** aspect ratio on the thumbnail container.
    *   **Interaction:** Apply a `scale(1.03)` transform on hover to the root `<Link>` element.

### **2.1.4. Thumbnail Overlay Details**

*   **Background:** Semi-transparent white: **`rgba(255, 255, 255, 0.85)`**.
*   **Position:** Occupies the bottom ~15% of the thumbnail's total height.
*   **Typography:**
    *   **Font:** Inter.
    *   **Size:** `text-xs`.
    *   **Weight:** `font-medium` (500).
    *   **Letter Spacing:** `tracking-wider`.
    *   **Color:** Dark grey: **`#374151`**.
    *   **Alignment:** Text must be perfectly centered (horizontally and vertically) within the overlay area.

### **2.1.5. Responsive Behavior Specification**

The layout must adapt gracefully across three main breakpoints.

*   **Desktop (1024px and up):**
    *   **Implementation:** The full "Layering with Negative Margins" strategy is active.
    *   **Grid:** `grid-cols-4`.
*   **Tablet (768px to 1023px):**
    *   **Implementation:** The layering strategy is still active.
    *   **Grid:** `grid-cols-2`. The "Content Row" will wrap naturally. The developer must ensure the "THEMES" text remains aligned with the first row of thumbnails.
*   **Mobile (below 768px):**
    *   **Implementation:** The layout must **vertically stack**.
    *   **Block 1 (`MAYA LAMA`):** Typography should be scaled down (e.g., `text-4xl`).
    *   **Block 2 (Content Row):**
        *   The negative top margin must be **removed** (`-mt-16` becomes `mt-8` or similar positive value).
        *   The flex direction should change to column (`flex-direction: column`).
        *   The "THEMES" label will now sit directly above the thumbnail grid.
        *   **Grid:** `grid-cols-2` or `grid-cols-1` depending on what looks best. A `2x2` grid is preferred if space allows.

### **2.1.6. Final Checklist for Developer**

*   [ ] Use `next/font` to self-host and preload "Playfair Display" and "Inter" to prevent layout shift.
*   [ ] Implement the layout using the specified negative margin technique.
*   [ ] Ensure `items-baseline` is used for the critical "THEMES"/grid alignment.
*   [ ] Build a reusable `<Thumbnail />` component with the specified internal structure.
*   [ ] Verify the responsive behavior at all three breakpoints, paying close attention to the mobile layout stack.
*   [ ] All interactive elements must have clear `:hover` and `:focus` states.