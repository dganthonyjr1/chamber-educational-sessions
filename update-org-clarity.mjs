import { drizzle } from "drizzle-orm/mysql2";
import { organizations } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function updateOrganizations() {
  console.log("Updating organizations with specific names and locations...");

  // Update Sudden Impact Agency
  await db
    .update(organizations)
    .set({
      name: "Sudden Impact Agency",
      nameEs: "Agencia Sudden Impact",
      description: "Digital marketing and AI automation agency helping businesses grow with custom AI solutions and visibility strategies.",
      descriptionEs: "Agencia de marketing digital y automatización de IA que ayuda a las empresas a crecer con soluciones de IA personalizadas y estrategias de visibilidad.",
      website: "https://suddenimpactagency.com",
      joinUrl: "https://suddenimpactagency.com/contact",
    })
    .where(eq(organizations.slug, "sudden-impact-agency"));

  // Update to Wildwood Chamber of Commerce
  await db
    .update(organizations)
    .set({
      name: "Wildwood Chamber of Commerce",
      nameEs: "Cámara de Comercio de Wildwood",
      description: "Supporting local businesses in Wildwood, NJ with networking, education, and advocacy. Serving the Greater Wildwoods business community.",
      descriptionEs: "Apoyando a empresas locales en Wildwood, NJ con redes, educación y defensa. Sirviendo a la comunidad empresarial de Greater Wildwoods.",
      website: "https://wildwoodsnj.com",
      joinUrl: "https://wildwoodsnj.com/membership",
      location: "Wildwood, NJ",
    })
    .where(eq(organizations.slug, "local-chamber"));

  // Update Tech Entrepreneurs Network
  await db
    .update(organizations)
    .set({
      name: "Tech Entrepreneurs Network",
      nameEs: "Red de Emprendedores Tecnológicos",
      description: "Community of technology entrepreneurs and innovators sharing knowledge, resources, and opportunities for growth.",
      descriptionEs: "Comunidad de emprendedores tecnológicos e innovadores que comparten conocimientos, recursos y oportunidades de crecimiento.",
      website: "https://techentrepreneurs.network",
      joinUrl: "https://techentrepreneurs.network/join",
    })
    .where(eq(organizations.slug, "tech-entrepreneurs"));

  console.log("✅ Organizations updated with specific names and locations!");
}

updateOrganizations().catch(console.error);
