import { drizzle } from 'drizzle-orm/mysql2';
import { courses } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

const courseTranslations = [
  {
    id: 1,
    titleEs: '¿Qué es la IA?',
    descriptionEs: 'Comprende los fundamentos de la Inteligencia Artificial y cómo funciona en contextos empresariales.'
  },
  {
    id: 2,
    titleEs: 'IA para Tareas Empresariales',
    descriptionEs: 'Aprende cómo aplicar la IA para automatizar y optimizar operaciones comerciales comunes.'
  },
  {
    id: 3,
    titleEs: 'IA para Crecimiento Empresarial',
    descriptionEs: 'Descubre estrategias para aprovechar la IA para escalar tu negocio y aumentar los ingresos.'
  },
  {
    id: 4,
    titleEs: 'Seguridad y Ética de la IA',
    descriptionEs: 'Navega el uso responsable de la IA, incluyendo privacidad de datos, sesgo y consideraciones éticas.'
  },
  {
    id: 5,
    titleEs: 'Automatización Avanzada de IA',
    descriptionEs: 'Próximamente: Profundiza en técnicas avanzadas de automatización de IA, flujos de trabajo personalizados y estrategias de integración de IA a nivel empresarial.'
  },
  {
    id: 6,
    titleEs: 'Liderazgo y Estrategia de IA',
    descriptionEs: 'Próximamente: Aprende cómo liderar la transformación de IA en tu organización, construir equipos de IA y desarrollar estrategias de IA a largo plazo.'
  }
];

async function updateTranslations() {
  console.log('Updating course translations...');
  
  for (const translation of courseTranslations) {
    await db.update(courses)
      .set({
        titleEs: translation.titleEs,
        descriptionEs: translation.descriptionEs
      })
      .where(eq(courses.id, translation.id));
    console.log(`Updated course ${translation.id}`);
  }
  
  console.log('✅ All translations updated!');
  process.exit(0);
}

updateTranslations().catch(console.error);
