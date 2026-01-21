import { drizzle } from 'drizzle-orm/mysql2';
import { courses } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

const courseUpdates = [
  {
    id: 1,
    title: 'What Is AI?',
    titleEs: '¿Qué es la IA?',
    description: 'Learn what AI really is in simple terms. Understanding the basics of Artificial Intelligence in plain English, no tech experience needed.',
    descriptionEs: 'Aprende qué es realmente la IA en términos simples. Comprende los fundamentos de la Inteligencia Artificial en lenguaje claro, sin experiencia técnica necesaria.'
  },
  {
    id: 2,
    title: 'AI for Business Tasks',
    titleEs: 'IA para Tareas Empresariales',
    description: 'Discover how AI can automate and optimize your daily business operations. Learn practical applications for marketing, sales, and customer service.',
    descriptionEs: 'Descubre cómo la IA puede automatizar y optimizar tus operaciones comerciales diarias. Aprende aplicaciones prácticas para marketing, ventas y servicio al cliente.'
  },
  {
    id: 3,
    title: 'AI for Business Growth',
    titleEs: 'IA para Crecimiento Empresarial',
    description: 'Master AI strategies for marketing, sales, and scaling your business. Learn how to leverage AI to increase revenue and expand your reach.',
    descriptionEs: 'Domina las estrategias de IA para marketing, ventas y escalar tu negocio. Aprende cómo aprovechar la IA para aumentar ingresos y expandir tu alcance.'
  },
  {
    id: 4,
    title: 'AI Safety & Ethics',
    titleEs: 'Seguridad y Ética de la IA',
    description: 'Using AI responsibly and confidently. Navigate data privacy, bias, ethical considerations, and the future of AI in business.',
    descriptionEs: 'Usa la IA de manera responsable y con confianza. Navega la privacidad de datos, sesgo, consideraciones éticas y el futuro de la IA en los negocios.'
  },
  {
    id: 5,
    title: 'Advanced AI Automation',
    titleEs: 'Automatización Avanzada de IA',
    description: 'Coming Soon: Deep dive into advanced AI automation techniques, custom workflows, and enterprise-level AI integration strategies.',
    descriptionEs: 'Próximamente: Profundiza en técnicas avanzadas de automatización de IA, flujos de trabajo personalizados y estrategias de integración de IA a nivel empresarial.'
  },
  {
    id: 6,
    title: 'AI Leadership & Strategy',
    titleEs: 'Liderazgo y Estrategia de IA',
    description: 'Coming Soon: Learn how to lead AI transformation in your organization, build AI teams, and develop long-term AI strategies.',
    descriptionEs: 'Próximamente: Aprende cómo liderar la transformación de IA en tu organización, construir equipos de IA y desarrollar estrategias de IA a largo plazo.'
  }
];

async function updateCourseDescriptions() {
  console.log('Updating course descriptions...');
  
  for (const course of courseUpdates) {
    await db.update(courses)
      .set({
        title: course.title,
        titleEs: course.titleEs,
        description: course.description,
        descriptionEs: course.descriptionEs
      })
      .where(eq(courses.id, course.id));
    console.log(`Updated course ${course.id}: ${course.title}`);
  }
  
  console.log('✅ All course descriptions updated!');
  process.exit(0);
}

updateCourseDescriptions().catch(console.error);
