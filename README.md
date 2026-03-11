Frontend Architecture
    Stack
        React
        Vite
        TypeScript
        Tailwind CSS
        Axios for API calls
        React Router for routing

    Architecture Style
        Component-based SPA (Single Page Application)

    Structure
        ├── components
        │     ├── AddCategoryModal.tsx
        │     ├── TopicCard.tsx
        │
        ├── pages
        │     ├── Dashboard.tsx
        │     ├── HLDPage.tsx
        │     ├── LLDPage.tsx
        │
        ├── services
        │     └── api.ts (axios configs)
        │
        ├── utils
        │
        ├── App.tsx
        └── main.tsx
    
    Flow
        User → React UI → Axios → Backend API