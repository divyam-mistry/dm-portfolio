export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface Project {
  name: string;
  techStack: string[];
  period?: string;
  description: string[];
  status?: string;
}

export interface SkillCategory {
  category: string;
  technologies: string[];
}

export interface Achievement {
  title: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  url?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  graduation: string;
  cgpa?: string;
  coursework?: string[];
}

export interface Stat {
  value: string;
  suffix?: string;
  label: string;
}

export const experiences: Experience[] = [
  {
    company: "EzyInn Technologies Pvt. Ltd. (Simulas)",
    role: "Trainee Backend Intern (Full-time)",
    period: "Dec 2022 – May 2023",
    description: [
      "Coded efficient and reusable REST APIs using Node.js and Express, and implemented complex webhooks for bookings from Online Travel Agencies, reducing processing time by 30%.",
      "Successfully integrated Stripe Elements and APIs, as well as Shift4 Iframes to enhance payment processing, leading to a 20% increase in successful transactions.",
      "Handled primary on-calls to support, troubleshoot, monitor, and optimize production systems.",
      "Collaborated with the frontend team to ensure seamless integration between backend and frontend components.",
    ],
  },
  {
    company: "Evolveinno Inc. (Nearlikes)",
    role: "Junior Flutter Developer (Part-time)",
    period: "Sep 2021 – Nov 2021",
    description: [
      "Integrated backend APIs into a Flutter application, resulting in a seamless user experience and reducing API response time by 25%.",
      "Implemented new features and bug fixes, contributing to a 15% increase in user engagement and overall application performance.",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "PixelChat",
    techStack: ["React", "Node", "MongoDB", "Redux", "Material UI", "JWT", "Socket.io"],
    status: "Work in Progress",
    description: [
      "Developed and designed PixelChat, a social media application featuring user authentication using JWT, image uploading with Multer, and real-time chat using RESTful APIs and Socket.io.",
      "Utilized Redux for state management, resulting in a 30% improvement in application responsiveness.",
    ],
  },
  {
    name: "RealStream",
    techStack: ["Apache Kafka", "Spring Boot", "MySQL"],
    period: "Jun 2023",
    description: [
      "Developed a real-time messaging system for reliable and scalable data communication between microservices.",
      "Designed and implemented efficient Kafka producers and consumers to handle high-volume data streams (from Wikimedia), enabling asynchronous communication across system components.",
    ],
  },
  {
    name: "Verbyl",
    techStack: ["Flutter", "Firebase", "Python", "Flask", "PHP", "MySQL", "Heroku"],
    period: "Dec 2021 – Mar 2022",
    description: [
      "Coded and maintained Verbyl, a music streaming mobile application.",
      "Connected Firebase authentication and RESTful APIs for a secure user experience.",
      "Implemented advanced features like mood prediction (85% accuracy), song recommendations, and playlist creation, resulting in a 25% increase in user retention.",
    ],
  },
  {
    name: "ShopEra",
    techStack: ["Flutter", "Firebase", "HTML", "CSS", "JS", "PHP", "MySQL"],
    period: "Feb 2021 – Aug 2021",
    description: [
      "Developed ShopEra, a fully functional multi-user online e-commerce platform by onboarding nearby shops.",
      "Designed an intuitive user interface with product search, filtering, sorting, and a secure checkout process.",
    ],
  },
];

export const skills: SkillCategory[] = [
  {
    category: "Programming",
    technologies: ["C/C++", "Java", "Python", "C#", "JavaScript", "HTML/CSS"],
  },
  {
    category: "Frameworks/Libraries",
    technologies: ["React.js", "Node.js", "Express.js", "Flutter", "Spring Boot", "Apache Kafka", "REST API", "Bootstrap"],
  },
  {
    category: "Databases",
    technologies: ["MongoDB", "MySQL", "Firebase", "PostgreSQL", "Redis"],
  },
  {
    category: "Tools",
    technologies: ["Postman", "GitHub", "GitLab", "NetBeans", "Visual Studio Code", "Spring Tool Suite"],
  },
];

export const achievements: Achievement[] = [
  {
    title: "Competitive Programming",
    description: "Solved 600+ problems on LeetCode, Codeforces, CodeChef, and other coding platforms, consistently ranking in the top 15% of participants.",
  },
  {
    title: "Hackathons",
    description: "Participated in a 48-hour hackathon (CoviHacks) and finished in the top 15 out of 50+ participants, developing a mobile application to detect COVID using X-ray.",
  },
  {
    title: "Extra-Curricular",
    description: "Led the team as Captain to victory in the State Level Basketball Tournament held in Baroda, Gujarat.",
  },
];

export const certifications: Certification[] = [
  {
    name: "Lyft Back-End Engineering Virtual Experience Program",
    issuer: "Forage",
  },
  {
    name: "The Complete 2023 Web Development Bootcamp",
    issuer: "Udemy",
  },
  {
    name: "Complete Flutter App Development Bootcamp with Dart",
    issuer: "Udemy",
  },
];

export const education: Education = {
  degree: "B.Tech in Information Technology",
  institution: "Dharmsinh Desai University",
  location: "Nadiad, Gujarat",
  graduation: "May 2023",
  cgpa: "8.86 / 10",
  coursework: [
    "Data Structures and Algorithms",
    "Database Management Systems",
    "Web Technologies",
    "Software Engineering",
    "Object-Oriented Programming",
  ],
};

export const stats: Stat[] = [
  { value: "600", suffix: "+", label: "Problems solved" },
  { value: "4", label: "Projects shipped" },
  { value: "2", label: "Internships" },
  { value: "8.86", label: "CGPA / 10" },
];

export const contactInfo = {
  email: "divsmistry30@gmail.com",
  phone: "+91-72269-66419",
  github: "#",
  linkedin: "#",
  leetcode: "#",
};
