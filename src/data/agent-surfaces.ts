import { getCollection } from 'astro:content';

import { education, experience } from './experience';
import { domains } from './expertise';
import {
  resumeEducation,
  resumeExperience,
  resumeProjects,
  resumeSkills,
} from './resume';
import { site } from './site';
import { spotlightProducts } from './spotlight-products';

export type AgentSurface = {
  id: string;
  path: string;
  title: string;
  description: string;
  markdown: string;
};

export function markdownPathFor(path: string) {
  return path === '/' ? '/index.md' : `${path}.md`;
}

export async function getAgentSurfaces(): Promise<AgentSurface[]> {
  const [workEntries, blogEntries] = await Promise.all([
    getCollection('work'),
    getCollection('blog', ({ data }) => !data.draft),
  ]);

  const sortedWork = [...workEntries].sort(
    (a, b) => a.data.order - b.data.order
  );
  const sortedBlog = [...blogEntries].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const home = renderHome();
  const about = renderAbout();
  const projects = renderProjects();
  const resume = renderResume();
  const blogIndex = [
    '# Writing by Sarthak Agrawal',
    '',
    'Technical notes about AI infrastructure, distributed systems, product engineering, and operating a public software fleet.',
    '',
    ...sortedBlog.map(
      (entry) =>
        `- [${entry.data.title}](${site.url}/blog/${entry.id}): ${entry.data.description}`
    ),
  ].join('\n');

  return [
    surface('home', '/', site.name, site.description, home),
    surface(
      'about',
      '/about',
      `About ${site.name}`,
      `${site.name}'s engineering background, experience, education, and technical focus.`,
      about
    ),
    surface(
      'projects',
      '/projects',
      'Projects',
      'Selected public products and the canonical SaaS Maker directory.',
      projects
    ),
    surface(
      'resume',
      '/resume',
      `${site.name} resume`,
      'Work experience, skills, selected projects, and education.',
      resume
    ),
    surface(
      'blog',
      '/blog',
      'Writing',
      'Technical writing by Sarthak Agrawal.',
      blogIndex
    ),
    ...sortedBlog.map((entry) =>
      surface(
        `blog-${entry.id}`,
        `/blog/${entry.id}`,
        entry.data.title,
        entry.data.description,
        renderContentEntry(entry.data.title, entry.data.description, entry.body)
      )
    ),
    surface(
      'privacy',
      '/privacy',
      'Privacy',
      'Privacy boundaries for the static portfolio site.',
      [
        '# Privacy',
        '',
        'This is a static portfolio site. It has no account system, application database, advertising tracker, or user-content upload.',
        '',
        'The site may fetch public GitHub repository metadata at build time. Visiting linked products or external profiles is governed by those destinations.',
        '',
        `Contact: ${site.email}`,
      ].join('\n')
    ),
    ...sortedWork.map((entry) =>
      surface(
        `work-${entry.id}`,
        `/work/${entry.id}`,
        entry.data.title,
        entry.data.summary,
        renderContentEntry(
          entry.data.title,
          [
            entry.data.summary,
            '',
            `Role: ${entry.data.role}`,
            `Year: ${entry.data.year}`,
            `Stack: ${entry.data.stack.join(', ')}`,
            ...(entry.data.repo ? [`Source: ${entry.data.repo}`] : []),
            ...(entry.data.demo ? [`Demo: ${entry.data.demo}`] : []),
          ].join('\n'),
          entry.body
        )
      )
    ),
  ];
}

function surface(
  id: string,
  path: string,
  title: string,
  description: string,
  markdown: string
): AgentSurface {
  return { id, path, title, description, markdown: `${markdown.trim()}\n` };
}

function renderHome() {
  const profileLinks = Object.entries(site.profiles).map(
    ([name, url]) => `- ${formatLabel(name)}: ${url}`
  );
  const productLinks = spotlightProducts.map(
    (product) => `- [${product.label}](${product.url}): ${product.description}`
  );

  return [
    `# ${site.name}`,
    '',
    `${site.role}. ${site.tagline}`,
    '',
    site.description,
    '',
    '## Current work',
    '',
    ...experience.map(
      (item) =>
        `- ${item.role}, ${item.company} (${item.period}): ${item.summary}`
    ),
    '',
    '## Selected products',
    '',
    ...productLinks,
    '',
    '## Canonical identity',
    '',
    `- Person ID: ${site.personId}`,
    `- Image: ${site.image}`,
    `- Location: ${site.location}`,
    ...profileLinks,
    `- Email: ${site.email}`,
  ].join('\n');
}

function renderAbout() {
  return [
    `# About ${site.name}`,
    '',
    site.description,
    '',
    '## Experience',
    '',
    ...experience.flatMap((item) => [
      `### ${item.role} — ${item.company}`,
      '',
      `${item.period}. ${item.summary}`,
      '',
      ...item.highlights.map((highlight) => `- ${highlight}`),
      '',
    ]),
    '## Technical focus',
    '',
    ...domains.flatMap((domain) => [
      `### ${domain.title}`,
      '',
      domain.blurb,
      '',
      `Tools: ${domain.items.join(', ')}`,
      '',
    ]),
    '## Education',
    '',
    `${education.degree}, ${education.school} (${education.period}).`,
  ].join('\n');
}

function renderProjects() {
  return [
    '# Projects',
    '',
    'The selected products below are the primary public work. SaaS Maker is the canonical directory for the broader maintained fleet.',
    '',
    ...spotlightProducts.flatMap((product) => [
      `## ${product.label}`,
      '',
      product.description,
      '',
      `- Product: ${product.url}`,
      `- Source: ${product.repositoryUrl}`,
      `- Organization: ${product.organizationUrl}`,
      '',
    ]),
  ].join('\n');
}

function renderResume() {
  return [
    `# ${site.name} — ${site.role}`,
    '',
    `Location: ${site.location}`,
    `Email: ${site.email}`,
    `LinkedIn: ${site.profiles.linkedin}`,
    `GitHub: ${site.profiles.github}`,
    '',
    '## Experience',
    '',
    ...resumeExperience.flatMap((item) => [
      `### ${item.role} — ${item.company}`,
      '',
      `${item.period}${item.note ? ` · ${item.note}` : ''}`,
      '',
      ...item.bullets.map((bullet) => `- ${bullet}`),
      '',
    ]),
    '## Skills',
    '',
    ...resumeSkills.map((group) => `- **${group.label}:** ${group.items}`),
    '',
    '## Selected projects',
    '',
    ...resumeProjects.flatMap((project) => [
      `### ${project.name}`,
      '',
      `Stack: ${project.stack}`,
      '',
      ...project.bullets.map((bullet) => `- ${bullet}`),
      '',
    ]),
    '## Education',
    '',
    `${resumeEducation.degree}, ${resumeEducation.school} (${resumeEducation.period}).`,
    '',
    resumeEducation.detail,
  ].join('\n');
}

function renderContentEntry(
  title: string,
  description: string,
  body: string | undefined
) {
  return [`# ${title}`, '', description, '', body?.trim() || ''].join('\n');
}

function formatLabel(value: string) {
  return value === 'huggingFace'
    ? 'Hugging Face'
    : `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
