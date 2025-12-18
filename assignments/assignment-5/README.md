# Next.js - Dynamic routes, data fetching

### **File Tree** (only section with dynamic routing)

    📁 app

      📁 explore

        📄 page.tsx --> Main explore page

        📁 [...slug]

          📄 page.tsx --> Contains logic to select appropriate view

      📁 guide

        📁 [airportCode]

          📄 page.tsx --> Airport overview

          📁 [citySlug]

            📄 page.tsx --> Guide page


    📁 components

      📁 views

        📄 ContinentView.tsx --> Continent overview

        📄 CountryView.tsx --> Country overview

        📄 CityView.tsx --> City overview


    📁 lib

      📄 data.ts --> Mockup data

