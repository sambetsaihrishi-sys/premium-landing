import { ProgressProvider } from "@/lib/progress-context";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Navigation from "@/components/Navigation";
import HeroScrollSequence from "@/components/HeroScrollSequence";

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["Python", "Java", "JavaScript", "C", "SQL", "HTML/CSS"],
  },
  {
    title: "Frontend",
    items: ["React.js", "HTML5", "CSS3", "JSON"],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "FastAPI",
      "REST APIs",
      "Pydantic",
      "JWT Authentication",
      "Session Management",
    ],
  },
  {
    title: "Databases",
    items: ["MongoDB", "PostgreSQL", "MySQL", "SQLite", "SQL"],
  },
  {
    title: "AI & Data Science",
    items: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "LLMs",
      "Generative AI",
      "LangChain",
      "AI Agents",
      "NumPy",
      "Pandas",
      "Scikit-learn",
    ],
  },
  {
    title: "Tools & DevOps",
    items: ["Git", "GitHub Actions", "Docker", "Azure", "Streamlit", "CI/CD"],
  },
];

const EXPERIENCE = {
  role: "Web Development Intern",
  company: "In Amigos Foundation",
  period: "May 2026 · Remote",
  points: [
    "Built and optimized responsive full-stack application components using React.js, Node.js, and TypeScript, improving data flow efficiency and UI performance.",
    "Integrated front-end interfaces with server-side logic and REST APIs, supporting system integration and troubleshooting asynchronous data updates within the SDLC.",
    "Collaborated with cross-functional remote teams to troubleshoot code and implement new features using Git for version control, debugging, and refactoring.",
    "Adhered to Agile development methodologies and sprint planning to ensure engineering excellence through rigorous QA, peer review, and automated testing.",
  ],
};

const PROJECTS = [
  {
    title: "AI Job Assistant",
    stack: "React.js · FastAPI · Python · MongoDB · Groq LLM · JWT",
    points: [
      "High-performance backend using FastAPI and Python with async, non-blocking microservices for production deployment.",
      "Secure RESTful APIs with JWT authentication and Pydantic for structured output validation, schema enforcement, and MCP tool invocation.",
      "Agentic AI pipeline using RAG, LangChain, and OpenAI APIs with tool-calling, ReAct loops, and stateful reasoning.",
      "NoSQL schemas in MongoDB for resume management, application tracking, and agent memory.",
    ],
  },
  {
    title: "Financial Discipline Scorer",
    stack: "Streamlit · Python · SQL · MongoDB · PostgreSQL · Docker",
    points: [
      "Data-driven fintech analytics platform in Python using SQL and PostgreSQL to model complex data relationships.",
      "Full-stack app with Streamlit and Docker, including automated reporting and dashboards for trend and performance monitoring.",
      "ML and EDA on transaction data with NumPy, Pandas, and Scikit-learn for forecasting and customer insights.",
      "Model evaluation via experiments, feature engineering, and statistical analysis, deployed with GitHub Actions CI/CD.",
    ],
  },
];

const CERTIFICATIONS = [
  "Introduction to Agent Skills — Anthropic",
  "Artificial Intelligence Fundamentals — IBM SkillsBuild",
  "Python using AI — AI for Techies",
  "Basics of Python — Unianthena",
  "Java Full Stack — Loyola Academy",
];

export default function Home() {
  return (
    <ProgressProvider>
      <SmoothScrollProvider>
        <Navigation />
        <main>
          <HeroScrollSequence />

          {/* About */}
          <section
            id="about"
            className="relative z-10 scroll-mt-24 bg-ink px-6 py-32 sm:px-16 sm:py-48"
          >
            <div className="mx-auto max-w-3xl">
              <h2 className="font-serif italic text-4xl text-paper sm:text-5xl">
                Analytical, full stack, agentic.
              </h2>
              <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-paper/70 sm:text-lg">
                Computer Science &amp; AI specialist with a focus on web
                application development, full stack engineering, and
                Python-based systems. Track record building scalable web
                applications and high-performance technical solutions,
                committed to modern engineering practices and SDLC
                methodologies for secure, reliable software.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {SKILL_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-paper/50">
                    {group.title}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-paper/80 sm:text-base">
                    {group.items.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section
            id="experience"
            className="relative z-10 scroll-mt-24 border-t border-paper/10 bg-ink px-6 py-32 sm:px-16"
          >
            <div className="mx-auto max-w-3xl">
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-paper/50">
                Experience
              </h3>
              <div className="mt-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-serif italic text-2xl text-paper sm:text-3xl">
                    {EXPERIENCE.role}
                  </h4>
                  <span className="text-sm font-light text-paper/50">
                    {EXPERIENCE.period}
                  </span>
                </div>
                <p className="mt-1 text-base font-light text-paper/70">
                  {EXPERIENCE.company}
                </p>
                <ul className="mt-6 space-y-3">
                  {EXPERIENCE.points.map((p, i) => (
                    <li
                      key={i}
                      className="text-sm font-light leading-relaxed text-paper/70 sm:text-base"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section
            id="projects"
            className="relative z-10 scroll-mt-24 border-t border-paper/10 bg-ink px-6 py-32 sm:px-16"
          >
            <div className="mx-auto max-w-5xl">
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-paper/50">
                Projects
              </h3>
              <div className="mt-8 grid gap-16 sm:grid-cols-2">
                {PROJECTS.map((proj) => (
                  <div key={proj.title}>
                    <h4 className="font-serif italic text-2xl text-paper sm:text-3xl">
                      {proj.title}
                    </h4>
                    <p className="mt-1 text-sm font-light text-paper/50">
                      {proj.stack}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {proj.points.map((p, i) => (
                        <li
                          key={i}
                          className="text-sm font-light leading-relaxed text-paper/70"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Education & Certifications */}
          <section
            id="education"
            className="relative z-10 scroll-mt-24 border-t border-paper/10 bg-ink px-6 py-32 sm:px-16"
          >
            <div className="mx-auto grid max-w-5xl gap-16 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-paper/50">
                  Education
                </h3>
                <div className="mt-8">
                  <h4 className="font-serif italic text-2xl text-paper sm:text-3xl">
                    Loyola Academy
                  </h4>
                  <p className="mt-1 text-sm font-light text-paper/70">
                    B.Sc. Computer Science &amp; Artificial Intelligence
                  </p>
                  <p className="mt-1 text-sm font-light text-paper/50">
                    2023 – 2026 · GPA 90% · Secunderabad, India
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-paper/50">
                  Certifications
                </h3>
                <ul className="mt-8 space-y-3">
                  {CERTIFICATIONS.map((c) => (
                    <li
                      key={c}
                      className="text-sm font-light leading-relaxed text-paper/70 sm:text-base"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <footer
            id="contact"
            className="relative z-10 scroll-mt-24 border-t border-paper/10 bg-ink px-6 py-24 text-center sm:px-16"
          >
            <h3 className="font-serif italic text-3xl text-paper sm:text-4xl">
              Let&rsquo;s build something.
            </h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-light text-paper/70">
              <a
                href="mailto:sambetsaihrishi@gmail.com"
                className="transition-colors duration-300 hover:text-paper"
              >
                sambetsaihrishi@gmail.com
              </a>
              <span className="text-paper/30">·</span>
              <a
                href="tel:+919390606403"
                className="transition-colors duration-300 hover:text-paper"
              >
                +91 93906 06403
              </a>
              <span className="text-paper/30">·</span>
              <a
                href="https://linkedin.com/in/sambet-sai-hrishi-980056309"
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-300 hover:text-paper"
              >
                LinkedIn
              </a>
            </div>
            <p className="mt-10 text-xs tracking-wide text-paper/30">
              © {new Date().getFullYear()} Sambet Sai Hrishi · Secunderabad, India
            </p>
          </footer>
        </main>
      </SmoothScrollProvider>
    </ProgressProvider>
  );
}
