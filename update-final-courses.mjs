import { drizzle } from 'drizzle-orm/mysql2';
import { courses } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

const finalCourses = [
  {
    id: 1,
    title: 'What is AI and What Isn\'t AI?',
    titleEs: '¿Qué es la IA y qué no es la IA?',
    description: 'Understand the fundamentals of Artificial Intelligence. Learn to distinguish real AI from marketing hype, explore how AI actually works, and discover what AI can and cannot do for your business.',
    descriptionEs: 'Comprende los fundamentos de la Inteligencia Artificial. Aprende a distinguir la IA real del marketing exagerado, explora cómo funciona realmente la IA y descubre qué puede y qué no puede hacer la IA por tu negocio.'
  },
  {
    id: 2,
    title: 'AI as a Basic Work Assistant',
    titleEs: 'IA como Asistente de Trabajo Básico',
    description: 'Discover how AI can become your everyday work companion. Learn practical ways to use AI tools for writing, research, scheduling, email management, and other daily tasks to boost your productivity.',
    descriptionEs: 'Descubre cómo la IA puede convertirse en tu compañero de trabajo diario. Aprende formas prácticas de usar herramientas de IA para escribir, investigar, programar, gestionar correos electrónicos y otras tareas diarias para aumentar tu productividad.'
  },
  {
    id: 3,
    title: 'Applying AI to Business Tasks',
    titleEs: 'Aplicando IA a Tareas Empresariales',
    description: 'Master specific AI applications for your business operations. Learn how to automate marketing, streamline sales processes, enhance customer service, analyze data, and optimize workflows using AI tools.',
    descriptionEs: 'Domina aplicaciones específicas de IA para tus operaciones comerciales. Aprende cómo automatizar marketing, optimizar procesos de ventas, mejorar el servicio al cliente, analizar datos y optimizar flujos de trabajo usando herramientas de IA.'
  },
  {
    id: 4,
    title: 'AI Safety, Automation, & Virtual Employees',
    titleEs: 'Seguridad de IA, Automatización y Empleados Virtuales',
    description: 'Navigate the future of AI in your business. Learn about data privacy, ethical AI use, advanced automation strategies, and how to integrate AI virtual employees while maintaining security and compliance.',
    descriptionEs: 'Navega el futuro de la IA en tu negocio. Aprende sobre privacidad de datos, uso ético de IA, estrategias avanzadas de automatización y cómo integrar empleados virtuales de IA mientras mantienes seguridad y cumplimiento.'
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

async function updateFinalCourses() {
  console.log('Updating courses with final titles and descriptions...');
  
  for (const course of finalCourses) {
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
  
  console.log('✅ All courses updated with final content!');
  process.exit(0);
}

updateFinalCourses().catch(console.error);
