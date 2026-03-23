import type { Task, TaskStatus, TaskPriority, User } from "../types";

const statuses: TaskStatus[] = ["todo", "inprogress", "inreview", "done"];
const priorities: TaskPriority[] = ["critical", "high", "medium", "low"];

const names = [
  "Alice Johnson",
  "Bob Smith",
  "Carol Williams",
  "David Brown",
  "Emma Davis",
  "Frank Miller",
  "Grace Wilson",
  "Henry Moore",
  "Iris Taylor",
  "Jack Anderson",
  "Kate Thomas",
  "Leo Jackson",
];

const taskTitles = [
  "Implement authentication",
  "Fix navigation bug",
  "Update documentation",
  "Refactor API endpoints",
  "Design landing page",
  "Optimize database queries",
  "Add unit tests",
  "Review pull request",
  "Deploy to production",
  "Setup CI/CD pipeline",
  "Migrate to TypeScript",
  "Improve accessibility",
  "Add dark mode",
  "Implement search",
  "Fix memory leak",
  "Update dependencies",
  "Create user dashboard",
  "Add analytics",
  "Optimize images",
  "Setup monitoring",
  "Add error tracking",
  "Implement caching",
  "Add rate limiting",
  "Setup backup system",
  "Create admin panel",
  "Add email notifications",
  "Implement webhooks",
  "Add file upload",
  "Create mobile app",
  "Add payment integration",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function getRandomColor(): string {
  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];
  return getRandomElement(colors);
}

export function generateUsers(): User[] {
  return names.map((name, index) => ({
    id: `user-${index + 1}`,
    name,
    initials: getInitials(name),
    color: getRandomColor(),
  }));
}

export function generateTasks(count: number, users: User[]): Task[] {
  const tasks: Task[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + daysOffset);

    let startDate: Date | undefined;
    if (Math.random() > 0.3) {
      const startDaysOffset = daysOffset - Math.floor(Math.random() * 14) - 1;
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() + startDaysOffset);
    }

    tasks.push({
      id: `task-${i + 1}`,
      title: `${getRandomElement(taskTitles)} #${i + 1}`,
      status: getRandomElement(statuses),
      priority: getRandomElement(priorities),
      assignee: getRandomElement(users).id,
      dueDate,
      startDate,
      description: `Task description for task ${i + 1}`,
    });
  }

  return tasks;
}
