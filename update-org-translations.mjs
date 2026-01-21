import { drizzle } from 'drizzle-orm/mysql2';
import { organizations } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

const orgTranslations = [
  {
    slug: 'sudden-impact-agency',
    nameEs: 'Agencia de Impacto Súbito',
    descriptionEs: 'Agencia de marketing digital y automatización de IA que ayuda a las empresas a crecer.'
  },
  {
    slug: 'local-chamber',
    nameEs: 'Cámara de Comercio Local',
    descriptionEs: 'Apoyando a empresas locales con redes, educación y defensa.'
  },
  {
    slug: 'tech-entrepreneurs',
    nameEs: 'Red de Emprendedores Tecnológicos',
    descriptionEs: 'Comunidad de emprendedores tecnológicos e innovadores.'
  }
];

async function updateOrgTranslations() {
  console.log('Updating organization translations...');
  
  for (const translation of orgTranslations) {
    await db.update(organizations)
      .set({
        nameEs: translation.nameEs,
        descriptionEs: translation.descriptionEs
      })
      .where(eq(organizations.slug, translation.slug));
    console.log(`Updated organization ${translation.slug}`);
  }
  
  console.log('✅ All organization translations updated!');
  process.exit(0);
}

updateOrgTranslations().catch(console.error);
