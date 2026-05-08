# Rangved Website Redesign

## Overview
The Rangved website has been completely redesigned with a **warmer color theme** and **premium animations** using GSAP. The site now features a modern, elegant design that better represents the theatre movement's mission and values.

## Key Changes

### 🎨 Color Theme Update
- **Changed from**: Dark brown theme (#1a1208 background)
- **Changed to**: Warm beige/cream theme (#faf7f2 background)
- **New palette**:
  - Background: `#faf7f2` (warm cream)
  - Foreground: `#2d1810` (deep brown)
  - Primary (Saffron): `#e07b39`
  - Secondary (Gold): `#d4a853`
  - Accent (Terracotta): `#c97856`
  - Light backgrounds: `#fff9f0`, `#f5e6d3`, `#e8d5c4`

### 📑 New Component Structure

All sections are now separate, reusable components that can be easily reordered:

1. **Hero** (`Hero.tsx`) - Landing section with curtain reveal animation
2. **AboutVision** (`AboutVision.tsx`) - Combined About & Vision 2027
3. **ServicesNew** (`ServicesNew.tsx`) - Apple-style scroll reveal for 7 services
4. **WorkShowcase** (`WorkShowcase.tsx`) - YouTube video carousel
5. **LegacyTimeline** (`LegacyTimeline.tsx`) - Timeline of work history
6. **FrameworkImpact** (`FrameworkImpact.tsx`) - 4-step framework + impact stats
7. **FounderNew** (`FounderNew.tsx`) - Founder profile with expertise
8. **TestimonialsNew** (`TestimonialsNew.tsx`) - 7 testimonials in card grid
9. **ContactNew** (`ContactNew.tsx`) - Contact form and info
10. **FooterNew** (`FooterNew.tsx`) - Footer with links and social

### ✨ Animation Features

- **GSAP ScrollTrigger** animations throughout
- **Curtain reveal** effect on Hero section
- **Apple-style scroll pinning** for Services section
- **Smooth parallax** effects on scroll
- **Stagger animations** for lists and cards
- **Fade and slide** transitions for content

### 🖼️ Image Placeholders

Images are currently replaced with colored placeholder boxes or commented out. Here's where to add images:

#### Services Section (`ServicesNew.tsx`)
```tsx
// Lines 80-87: Replace the gradient box with actual images
// Uncomment lines 88-93 and add images at:
// /public/images/services/service-1.jpg
// /public/images/services/service-2.jpg
// ... through service-7.jpg
```

#### Legacy Timeline (`LegacyTimeline.tsx`)
```tsx
// Lines 114-131: Replace gradient boxes with actual images
// Uncomment lines 132-147 and add images at:
// /public/images/legacy/legacy-1.jpg
// /public/images/legacy/legacy-2.jpg
// /public/images/legacy/legacy-3.jpg
```

#### Founder Section (`FounderNew.tsx`)
```tsx
// Lines 61-67: Replace the "RT" placeholder with founder photo
// Uncomment lines 68-73 and add image at:
// /public/images/founder/rithik-thakur.jpg
```

### 📹 YouTube Videos

Update the video URLs in `WorkShowcase.tsx` (line 9):
```tsx
const YOUTUBE_VIDEOS = [
  "https://www.youtube.com/watch?v=V5Ei3RkByr0",
  "https://www.youtube.com/watch?v=RzhNmN9jrCM",
  "https://www.youtube.com/watch?v=RzhNmN9jrCM", // Update this duplicate
];
```

## 🚀 Running the Project

```bash
cd rangved-website
npm install  # If needed
npm run dev
```

The site will be available at: **http://localhost:3000**

## 📂 Component Order

To change the order of sections, simply reorder the components in `src/app/page.tsx`:

```tsx
<main>
  <Hero />
  <AboutVision />
  <ServicesNew />
  <WorkShowcase />
  <LegacyTimeline />
  <FrameworkImpact />
  <FounderNew />
  <TestimonialsNew />
  <ContactNew />
</main>
```

## 🎯 Services List

The services section includes all 7 core services:
1. Integrated Theatre Curriculum
2. Hobby Classes & Clubs
3. Summer Camps
4. Event Management
5. Annual Day Productions
6. Corporate Workshops
7. Mime & Street Theatre

## 📊 Impact Statistics

Current stats displayed:
- **8+** Schools Served
- **3K** Students Trained
- **20+** Productions Directed
- **10+** Workshops Conducted

Update these in `FrameworkImpact.tsx` (lines 33-38) as needed.

## 🎭 Framework Steps

The Rangved Framework includes 4 movements:
1. **Foundation** - Build Basics
2. **Exploration** - Discover Self
3. **Performance** - Apply & Perform
4. **Reflection** - Learn & Grow

## 📝 Adding Images - Step by Step

### 1. Create the images directory structure:
```
rangved-website/
  public/
    images/
      services/
        service-1.jpg
        service-2.jpg
        ...service-7.jpg
      legacy/
        legacy-1.jpg
        legacy-2.jpg
        legacy-3.jpg
      founder/
        rithik-thakur.jpg
```

### 2. In each component file:
- Find the commented `<img>` tag
- Uncomment it
- Comment or remove the placeholder `<div>` above it

### Example (ServicesNew.tsx):
**Before:**
```tsx
<div className="w-full h-64 bg-gradient-to-br from-[#e07b39] to-[#d4a853] rounded-2xl mb-8 flex items-center justify-center text-white text-6xl font-bold">
  {service.id}
</div>
{/* <img 
  src="/images/services/service-${service.id}.jpg" 
  alt="${service.title}"
  className="w-full h-64 object-cover rounded-2xl mb-8"
/> */}
```

**After:**
```tsx
{/* <div className="w-full h-64 bg-gradient-to-br from-[#e07b39] to-[#d4a853] rounded-2xl mb-8 flex items-center justify-center text-white text-6xl font-bold">
  {service.id}
</div> */}
<img 
  src={`/images/services/service-${service.id}.jpg`}
  alt={service.title}
  className="w-full h-64 object-cover rounded-2xl mb-8"
/>
```

## 🔧 Technology Stack

- **Next.js 16.2.4** (Turbopack)
- **React 19.2.4**
- **GSAP 3.15.0** with ScrollTrigger
- **Framer Motion 12.38.0**
- **Tailwind CSS 4**
- **Lucide React** (Icons)
- **Lenis** (Smooth scroll)

## 🎨 Design Features

- **Gradient backgrounds** throughout
- **Glassmorphism effects** (backdrop-blur)
- **Rounded corners** (rounded-3xl)
- **Smooth shadows** (shadow-xl)
- **Hover animations** (scale, translate)
- **Responsive design** (mobile-first)

## 📱 Responsive Breakpoints

The design is fully responsive with breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## 🌟 Special Effects

### Services Section
- **Pin effect**: Section pins while services scroll through
- **Fade in/out**: Each service fades and scales
- **Progress indicators**: Dots at bottom show progress

### Legacy Timeline
- **Vertical line**: Connects all timeline events
- **Animated dots**: Mark each major category
- **Staggered entry**: Events animate in sequence

### Framework Cards
- **Hover lift**: Cards lift on hover
- **Roman numerals**: I, II, III, IV for each step
- **Color-coded**: Each section uses gradient colors

## 🔄 Future Enhancements

Suggestions for future updates:
- Add actual social media links in Footer
- Implement contact form submission
- Add video autoplay in WorkShowcase
- Create admin panel for content updates
- Add more interactive animations
- Implement dark/light mode toggle

## 📞 Contact Information

Update contact details in:
- `ContactNew.tsx` (lines 60-100)
- `FooterNew.tsx` (lines 108-127)

Current contact:
- **Phone**: 6301654700
- **Email**: rangved00@gmail.com
- **Location**: Begumpet, Hyderabad

---

## 🎬 Ready to Go!

The website is now live at **http://localhost:3000** with all sections implemented and ready for content updates. Just add your images and you're all set! 🚀

For any questions or modifications, refer to the component files in:
```
rangved-website/src/app/components/
```

**Enjoy your new premium Rangved website! 🎭✨**
