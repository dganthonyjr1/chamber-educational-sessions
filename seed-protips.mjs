import { drizzle } from "drizzle-orm/mysql2";
import { proTips, lessons } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

// Get all lessons
const allLessons = await db.select().from(lessons);

console.log(`Found ${allLessons.length} lessons`);

// Pro-tips for Course 1: What is AI and What Isn't AI?
const course1Tips = [
  {
    problem: "Customers confuse basic automation with AI, leading to unrealistic expectations",
    solution: "Educate clients on the difference between rule-based automation and machine learning. Show examples of each to set proper expectations.",
    problemEs: "Los clientes confunden la automatización básica con IA, generando expectativas poco realistas",
    solutionEs: "Educa a los clientes sobre la diferencia entre automatización basada en reglas y aprendizaje automático. Muestra ejemplos de cada uno para establecer expectativas adecuadas.",
  },
  {
    problem: "Marketing hype makes it difficult to identify genuine AI capabilities",
    solution: "Look for specific technical details: does it learn from data? Does it improve over time? Can it handle new situations without reprogramming?",
    problemEs: "El bombo publicitario dificulta identificar capacidades genuinas de IA",
    solutionEs: "Busca detalles técnicos específicos: ¿aprende de los datos? ¿Mejora con el tiempo? ¿Puede manejar situaciones nuevas sin reprogramación?",
  },
  {
    problem: "Business owners waste budget on 'AI' tools that are just fancy spreadsheets",
    solution: "Before purchasing, ask vendors to demonstrate how their AI adapts to your specific data and improves performance over time.",
    problemEs: "Los dueños de negocios desperdician presupuesto en herramientas 'IA' que son solo hojas de cálculo sofisticadas",
    solutionEs: "Antes de comprar, pide a los proveedores que demuestren cómo su IA se adapta a tus datos específicos y mejora el rendimiento con el tiempo.",
  },
];

// Pro-tips for Course 2: AI as a Basic Work Assistant
const course2Tips = [
  {
    problem: "Employees spend 2-3 hours daily on repetitive email responses and scheduling",
    solution: "Use AI email assistants like ChatGPT or Claude to draft responses, summarize threads, and suggest meeting times based on calendar availability.",
    problemEs: "Los empleados pasan 2-3 horas diarias en respuestas de correo repetitivas y programación",
    solutionEs: "Usa asistentes de correo con IA como ChatGPT o Claude para redactar respuestas, resumir hilos y sugerir horarios de reuniones según disponibilidad del calendario.",
  },
  {
    problem: "Small businesses can't afford full-time copywriters for social media and marketing",
    solution: "Train AI tools on your brand voice with 5-10 example posts. Use them to generate first drafts, then edit for authenticity and accuracy.",
    problemEs: "Las pequeñas empresas no pueden pagar redactores de tiempo completo para redes sociales y marketing",
    solutionEs: "Entrena herramientas de IA con tu voz de marca usando 5-10 publicaciones de ejemplo. Úsalas para generar borradores iniciales, luego edita para autenticidad y precisión.",
  },
  {
    problem: "Research and data gathering takes hours away from strategic work",
    solution: "Use AI research assistants to compile industry reports, competitor analysis, and market trends. Always verify critical facts with primary sources.",
    problemEs: "La investigación y recopilación de datos quita horas del trabajo estratégico",
    solutionEs: "Usa asistentes de investigación con IA para compilar informes de industria, análisis de competencia y tendencias de mercado. Siempre verifica hechos críticos con fuentes primarias.",
  },
  {
    problem: "Meeting notes are incomplete and action items get lost",
    solution: "Use AI transcription tools (Otter.ai, Fireflies) to capture full conversations, generate summaries, and extract action items automatically.",
    problemEs: "Las notas de reuniones están incompletas y los elementos de acción se pierden",
    solutionEs: "Usa herramientas de transcripción con IA (Otter.ai, Fireflies) para capturar conversaciones completas, generar resúmenes y extraer elementos de acción automáticamente.",
  },
];

// Pro-tips for Course 3: Applying AI to Business Tasks
const course3Tips = [
  {
    problem: "Customer service teams are overwhelmed with repetitive questions, causing slow response times",
    solution: "Implement AI chatbots for FAQs and tier-1 support. Route complex issues to humans. Monitor conversations to improve bot responses over time.",
    problemEs: "Los equipos de servicio al cliente están abrumados con preguntas repetitivas, causando tiempos de respuesta lentos",
    solutionEs: "Implementa chatbots con IA para preguntas frecuentes y soporte de nivel 1. Dirige problemas complejos a humanos. Monitorea conversaciones para mejorar respuestas del bot con el tiempo.",
  },
  {
    problem: "Sales teams waste time qualifying leads that will never convert",
    solution: "Use AI lead scoring to analyze behavior patterns, engagement history, and demographic data. Focus human effort on high-probability prospects.",
    problemEs: "Los equipos de ventas pierden tiempo calificando prospectos que nunca convertirán",
    solutionEs: "Usa puntuación de prospectos con IA para analizar patrones de comportamiento, historial de compromiso y datos demográficos. Enfoca el esfuerzo humano en prospectos de alta probabilidad.",
  },
  {
    problem: "Inventory management errors lead to stockouts or excess inventory costs",
    solution: "Deploy AI demand forecasting to predict sales patterns based on historical data, seasonality, and market trends. Automate reorder points.",
    problemEs: "Los errores de gestión de inventario llevan a desabastecimientos o costos excesivos de inventario",
    solutionEs: "Despliega pronóstico de demanda con IA para predecir patrones de ventas basados en datos históricos, estacionalidad y tendencias de mercado. Automatiza puntos de reorden.",
  },
  {
    problem: "Content creation for multiple channels is time-consuming and inconsistent",
    solution: "Use AI to repurpose one piece of content into multiple formats (blog → social posts → email → video script). Maintain brand guidelines in prompts.",
    problemEs: "La creación de contenido para múltiples canales consume tiempo y es inconsistente",
    solutionEs: "Usa IA para reutilizar una pieza de contenido en múltiples formatos (blog → publicaciones sociales → correo → guión de video). Mantén guías de marca en los prompts.",
  },
  {
    problem: "Data analysis paralysis - too much data, not enough insights",
    solution: "Use AI analytics tools to identify patterns, anomalies, and trends automatically. Focus human analysis on strategic interpretation and action planning.",
    problemEs: "Parálisis por análisis de datos - demasiados datos, no suficientes insights",
    solutionEs: "Usa herramientas de análisis con IA para identificar patrones, anomalías y tendencias automáticamente. Enfoca el análisis humano en interpretación estratégica y planificación de acciones.",
  },
];

// Pro-tips for Course 4: AI Safety, Automation, & Virtual Employees
const course4Tips = [
  {
    problem: "AI systems make decisions without transparency, creating compliance and trust issues",
    solution: "Implement explainable AI (XAI) tools that show decision-making logic. Document AI decision criteria and maintain human oversight for critical choices.",
    problemEs: "Los sistemas de IA toman decisiones sin transparencia, creando problemas de cumplimiento y confianza",
    solutionEs: "Implementa herramientas de IA explicable (XAI) que muestren la lógica de toma de decisiones. Documenta criterios de decisión de IA y mantén supervisión humana para elecciones críticas.",
  },
  {
    problem: "Data privacy violations from AI systems accessing sensitive customer information",
    solution: "Implement data minimization - only feed AI systems the minimum data needed. Use encryption, access controls, and regular privacy audits. Train staff on GDPR/CCPA compliance.",
    problemEs: "Violaciones de privacidad de datos por sistemas de IA que acceden a información sensible de clientes",
    solutionEs: "Implementa minimización de datos - solo alimenta sistemas de IA con los datos mínimos necesarios. Usa encriptación, controles de acceso y auditorías regulares de privacidad. Capacita al personal en cumplimiento GDPR/CCPA.",
  },
  {
    problem: "AI bias leads to unfair treatment of customers or employees",
    solution: "Regularly audit AI outputs for bias across demographics. Use diverse training data. Establish fairness metrics and human review processes for high-stakes decisions.",
    problemEs: "El sesgo de IA lleva a trato injusto de clientes o empleados",
    solutionEs: "Audita regularmente las salidas de IA para detectar sesgos entre demografías. Usa datos de entrenamiento diversos. Establece métricas de equidad y procesos de revisión humana para decisiones de alto riesgo.",
  },
  {
    problem: "Employees fear job loss from AI automation, reducing adoption and morale",
    solution: "Position AI as augmentation, not replacement. Retrain staff for higher-value work. Show how AI handles repetitive tasks so humans can focus on creative and strategic work.",
    problemEs: "Los empleados temen la pérdida de empleo por automatización con IA, reduciendo adopción y moral",
    solutionEs: "Posiciona la IA como aumento, no reemplazo. Recapacita al personal para trabajo de mayor valor. Muestra cómo la IA maneja tareas repetitivas para que los humanos puedan enfocarse en trabajo creativo y estratégico.",
  },
  {
    problem: "AI systems fail unexpectedly, causing business disruptions",
    solution: "Implement monitoring and alerting for AI performance degradation. Maintain fallback processes. Test AI systems regularly with edge cases and unexpected inputs.",
    problemEs: "Los sistemas de IA fallan inesperadamente, causando interrupciones del negocio",
    solutionEs: "Implementa monitoreo y alertas para degradación de rendimiento de IA. Mantén procesos de respaldo. Prueba sistemas de IA regularmente con casos extremos y entradas inesperadas.",
  },
  {
    problem: "Virtual employees (AI agents) lack context and make inappropriate decisions",
    solution: "Provide AI agents with comprehensive context documents, decision trees, and escalation protocols. Set clear boundaries on authority levels and require human approval for exceptions.",
    problemEs: "Los empleados virtuales (agentes de IA) carecen de contexto y toman decisiones inapropiadas",
    solutionEs: "Proporciona a los agentes de IA documentos de contexto completos, árboles de decisión y protocolos de escalación. Establece límites claros en niveles de autoridad y requiere aprobación humana para excepciones.",
  },
];

// Insert pro-tips for each lesson
async function insertProTips() {
  // Course 1 lessons (assuming first 3 lessons belong to course 1)
  const course1Lessons = allLessons.filter(l => l.courseId === 1);
  for (let i = 0; i < Math.min(course1Lessons.length, course1Tips.length); i++) {
    const lesson = course1Lessons[i];
    const tip = course1Tips[i];
    await db.insert(proTips).values({
      lessonId: lesson.id,
      problem: tip.problem,
      solution: tip.solution,
      problemEs: tip.problemEs,
      solutionEs: tip.solutionEs,
    });
    console.log(`✓ Added pro-tip for lesson ${lesson.id}: ${lesson.title}`);
  }

  // Course 2 lessons
  const course2Lessons = allLessons.filter(l => l.courseId === 2);
  for (let i = 0; i < Math.min(course2Lessons.length, course2Tips.length); i++) {
    const lesson = course2Lessons[i];
    const tip = course2Tips[i];
    await db.insert(proTips).values({
      lessonId: lesson.id,
      problem: tip.problem,
      solution: tip.solution,
      problemEs: tip.problemEs,
      solutionEs: tip.solutionEs,
    });
    console.log(`✓ Added pro-tip for lesson ${lesson.id}: ${lesson.title}`);
  }

  // Course 3 lessons
  const course3Lessons = allLessons.filter(l => l.courseId === 3);
  for (let i = 0; i < Math.min(course3Lessons.length, course3Tips.length); i++) {
    const lesson = course3Lessons[i];
    const tip = course3Tips[i];
    await db.insert(proTips).values({
      lessonId: lesson.id,
      problem: tip.problem,
      solution: tip.solution,
      problemEs: tip.problemEs,
      solutionEs: tip.solutionEs,
    });
    console.log(`✓ Added pro-tip for lesson ${lesson.id}: ${lesson.title}`);
  }

  // Course 4 lessons
  const course4Lessons = allLessons.filter(l => l.courseId === 4);
  for (let i = 0; i < Math.min(course4Lessons.length, course4Tips.length); i++) {
    const lesson = course4Lessons[i];
    const tip = course4Tips[i];
    await db.insert(proTips).values({
      lessonId: lesson.id,
      problem: tip.problem,
      solution: tip.solution,
      problemEs: tip.problemEs,
      solutionEs: tip.solutionEs,
    });
    console.log(`✓ Added pro-tip for lesson ${lesson.id}: ${lesson.title}`);
  }

  console.log("\n✅ All lesson-specific pro-tips seeded successfully!");
}

await insertProTips();
process.exit(0);
