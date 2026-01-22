import { drizzle } from "drizzle-orm/mysql2";
import { organizations } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedUSChambers() {
  console.log("Seeding US Chambers across different cities...");

  const chambers = [
    // Wildwood, NJ (already exists, just ensuring data)
    {
      name: "Wildwood Chamber of Commerce",
      nameEs: "Cámara de Comercio de Wildwood",
      slug: "wildwood-chamber",
      description: "Supporting local businesses in Wildwood, NJ with networking, education, and advocacy. Serving the Greater Wildwoods business community.",
      descriptionEs: "Apoyando a empresas locales en Wildwood, NJ con redes, educación y defensa. Sirviendo a la comunidad empresarial de Greater Wildwoods.",
      website: "https://wildwoodsnj.com",
      signupUrl: "https://wildwoodsnj.com/membership",
      primaryColor: "#00d9ff",
      city: "Wildwood",
      state: "NJ",
      memberCount: 45,
    },
    // New York City
    {
      name: "Manhattan Chamber of Commerce",
      nameEs: "Cámara de Comercio de Manhattan",
      slug: "manhattan-chamber",
      description: "Empowering businesses in Manhattan with networking opportunities, advocacy, and resources for growth in America's business capital.",
      descriptionEs: "Empoderando negocios en Manhattan con oportunidades de networking, defensa y recursos para crecer en la capital empresarial de América.",
      website: "https://manhattancc.org",
      signupUrl: "https://manhattancc.org/join",
      primaryColor: "#1E40AF",
      city: "New York",
      state: "NY",
      memberCount: 0,
    },
    // Los Angeles
    {
      name: "Los Angeles Area Chamber of Commerce",
      nameEs: "Cámara de Comercio del Área de Los Ángeles",
      slug: "la-chamber",
      description: "Building a prosperous LA region by connecting businesses, advocating for pro-business policies, and providing valuable resources.",
      descriptionEs: "Construyendo una región próspera de LA conectando negocios, abogando por políticas pro-empresariales y proporcionando recursos valiosos.",
      website: "https://lachamber.com",
      signupUrl: "https://lachamber.com/membership",
      primaryColor: "#DC2626",
      city: "Los Angeles",
      state: "CA",
      memberCount: 0,
    },
    // Chicago
    {
      name: "Chicagoland Chamber of Commerce",
      nameEs: "Cámara de Comercio de Chicagoland",
      slug: "chicago-chamber",
      description: "Driving economic growth in Chicagoland through business advocacy, networking events, and community engagement.",
      descriptionEs: "Impulsando el crecimiento económico en Chicagoland a través de la defensa empresarial, eventos de networking y compromiso comunitario.",
      website: "https://chicagolandchamber.org",
      signupUrl: "https://chicagolandchamber.org/join",
      primaryColor: "#0EA5E9",
      city: "Chicago",
      state: "IL",
      memberCount: 0,
    },
    // Miami
    {
      name: "Greater Miami Chamber of Commerce",
      nameEs: "Cámara de Comercio del Gran Miami",
      slug: "miami-chamber",
      description: "Connecting Miami's diverse business community with resources, advocacy, and opportunities for international trade and growth.",
      descriptionEs: "Conectando la diversa comunidad empresarial de Miami con recursos, defensa y oportunidades para el comercio internacional y el crecimiento.",
      website: "https://miamichamber.com",
      signupUrl: "https://miamichamber.com/become-a-member",
      primaryColor: "#F59E0B",
      city: "Miami",
      state: "FL",
      memberCount: 0,
    },
    // Houston
    {
      name: "Greater Houston Partnership",
      nameEs: "Asociación del Gran Houston",
      slug: "houston-chamber",
      description: "Serving as Houston's chamber of commerce, promoting business growth and economic development in the energy capital of the world.",
      descriptionEs: "Sirviendo como la cámara de comercio de Houston, promoviendo el crecimiento empresarial y el desarrollo económico en la capital energética del mundo.",
      website: "https://www.houston.org",
      signupUrl: "https://www.houston.org/membership",
      primaryColor: "#7C3AED",
      city: "Houston",
      state: "TX",
      memberCount: 0,
    },
    // Phoenix
    {
      name: "Phoenix Chamber of Commerce",
      nameEs: "Cámara de Comercio de Phoenix",
      slug: "phoenix-chamber",
      description: "Advancing business success in the Valley of the Sun through advocacy, connections, and leadership development.",
      descriptionEs: "Avanzando el éxito empresarial en el Valle del Sol a través de la defensa, conexiones y desarrollo de liderazgo.",
      website: "https://phoenixchamber.com",
      signupUrl: "https://phoenixchamber.com/join",
      primaryColor: "#EA580C",
      city: "Phoenix",
      state: "AZ",
      memberCount: 0,
    },
    // Seattle
    {
      name: "Seattle Metro Chamber",
      nameEs: "Cámara Metropolitana de Seattle",
      slug: "seattle-chamber",
      description: "Championing a thriving economy and vibrant community in the Pacific Northwest's innovation hub.",
      descriptionEs: "Defendiendo una economía próspera y una comunidad vibrante en el centro de innovación del Noroeste del Pacífico.",
      website: "https://seattlechamber.com",
      signupUrl: "https://seattlechamber.com/membership",
      primaryColor: "#10B981",
      city: "Seattle",
      state: "WA",
      memberCount: 0,
    },
  ];

  for (const chamber of chambers) {
    try {
      await db.insert(organizations).values(chamber).onDuplicateKeyUpdate({
        set: {
          name: chamber.name,
          nameEs: chamber.nameEs,
          description: chamber.description,
          descriptionEs: chamber.descriptionEs,
          website: chamber.website,
          signupUrl: chamber.signupUrl,
          primaryColor: chamber.primaryColor,
          city: chamber.city,
          state: chamber.state,
        },
      });
      console.log(`✅ Added/Updated: ${chamber.name} (${chamber.city}, ${chamber.state})`);
    } catch (error) {
      console.error(`❌ Error adding ${chamber.name}:`, error);
    }
  }

  console.log("\n✅ US Chambers seeded successfully!");
}

seedUSChambers().catch(console.error);
