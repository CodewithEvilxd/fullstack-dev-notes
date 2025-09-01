#!/usr/bin/env node

/**
 * Full-Stack Development Guide Explorer
 * A simple CLI tool to navigate through the learning materials
 */

const fs = require('fs');
const path = require('path');

class GuideExplorer {
  constructor() {
    this.basePath = __dirname;
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m'
    };
  }

  colorize(text, color) {
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  displayHeader() {
    console.log(this.colorize('🚀 Ultimate Full-Stack Web Development Guide', 'cyan'));
    console.log(this.colorize('===============================================', 'yellow'));
    console.log('');
  }

  displayMenu() {
    console.log(this.colorize('📚 Learning Path:', 'green'));
    console.log('');

    const phases = [
      {
        name: 'Phase 1: Foundations 🏗️',
        lessons: [
          'Lesson 0: Computer Basics',
          'Lesson 0.5: Internet Concepts',
          'Lesson 0.75: Git and GitHub',
          'Lesson 1: Introduction to Web Development',
          'Lesson 2: HTML Basics',
          'Lesson 3: CSS Basics',
          'Lesson 4: JavaScript Basics'
        ],
        files: [
          'Lesson 00_ Computer Basics.md',
          'Lesson 00.5_ Internet Concepts.md',
          'Lesson 00.75_ Git and GitHub.md',
          'Lesson 01_ Introduction to Web Development.md',
          'Lesson 02_ HTML Basics.md',
          'Lesson 03_ CSS Basics.md',
          'Lesson 04_ JavaScript Basics.md'
        ]
      },
      {
        name: 'Phase 2: Backend Development ⚙️',
        lessons: [
          'Lesson 5: Backend Development and Node.js',
          'Lesson 6: Express.js',
          'Lesson 7: Databases and MongoDB',
          'Lesson 8: Mongoose'
        ],
        files: [
          'Lesson 05_ Backend Development and Node.js.md',
          'Lesson 06_ Express.js.md',
          'Lesson 07_ Databases and MongoDB.md',
          'Lesson 08_ Mongoose.md'
        ]
      },
      {
        name: 'Phase 3: Frontend Frameworks ⚛️',
        lessons: [
          'Lesson 9: React Basics',
          'Lesson 10: React Hooks',
          'Lesson 11: React Router',
          'Lesson 12: Redux'
        ],
        files: [
          'Lesson 09_ React Basics.md',
          'Lesson 10_ React Hooks.md',
          'Lesson 11_ React Router.md',
          'Lesson 12_ Redux.md'
        ]
      },
      {
        name: 'Phase 4: Advanced Topics 🚀',
        lessons: [
          'Lesson 13: Authentication & Authorization',
          'Lesson 14: Testing - Unit, Integration & E2E',
          'Lesson 15: Deployment & DevOps',
          'Lesson 16: Full-Stack Development Roadmap & Best Practices'
        ],
        files: [
          'Lesson 13_ Authentication & Authorization.md',
          'Lesson 14_ Testing - Unit, Integration & E2E.md',
          'Lesson 15_ Deployment & DevOps.md',
          'Lesson 16_ Full-Stack Development Roadmap & Best Practices.md'
        ]
      },
      {
        name: 'Phase 5: Specialized Topics 🎯',
        lessons: [
          'Lesson 17: API Design and GraphQL',
          'Lesson 18: Real-Time Applications with WebSockets'
        ],
        files: [
          'Lesson 17_ API Design and GraphQL.md',
          'Lesson 18_ Real-Time Applications with WebSockets.md'
        ]
      }
    ];

    phases.forEach((phase, phaseIndex) => {
      console.log(this.colorize(`${phaseIndex + 1}. ${phase.name}`, 'yellow'));
      phase.lessons.forEach((lesson, lessonIndex) => {
        const fileName = phase.files[lessonIndex];
        const filePath = path.join(this.basePath, 'lessons', fileName);

        const exists = fs.existsSync(filePath);
        const status = exists ? '✅' : '❌';

        console.log(`   ${status} ${lesson}`);
      });
      console.log('');
    });

    console.log(this.colorize('📖 Specialized Guides:', 'green'));
    console.log('');

    const guides = [
      { name: 'Advanced JavaScript Guide', file: 'Advanced_JavaScript_Guide.md' },
      { name: 'Advanced React Guide', file: 'Advanced_React_Guide.md' },
      { name: 'Advanced Topics Guide', file: 'Advanced_Topics_Guide.md' },
      { name: 'API Calling & HTTP Methods Guide', file: 'API_Calling_HTTP_Methods_Guide.md' },
      { name: 'Backend Technologies', file: 'Backend_Technologies.md' },
      { name: 'Database Technologies', file: 'Database_Technologies.md' },
      { name: 'DevOps Deployment', file: 'DevOps_Deployment.md' },
      { name: 'Frontend Technologies', file: 'Frontend_Technologies.md' },
      { name: 'Postman API Testing Guide', file: 'Postman_API_Testing_Guide.md' },
      { name: 'Programming Languages Guide', file: 'Programming_Languages_Guide.md' },
      { name: 'Tools & Frameworks', file: 'Tools_Frameworks.md' },
      { name: 'Website Libraries & Framework Guide', file: 'Website_Libraries_Framework_Guide.md' }
    ];

    guides.forEach((guide) => {
      const filePath = path.join(this.basePath, 'guides', guide.file);
      const exists = fs.existsSync(filePath);
      const status = exists ? '✅' : '❌';

      console.log(`   ${status} ${guide.name}`);
    });

    console.log('');
    console.log(this.colorize('📚 Resources:', 'green'));
    console.log('');

    const resources = [
      { name: 'Career Best Practices', file: 'Career_Best_Practices.md' },
      { name: 'Code Examples & Practical Implementations', file: 'Code_Examples_Practical_Implementations.md' },
      { name: 'Learning Paths & Skill Trees', file: 'Learning_Paths_Skill_Trees.md' }
    ];

    resources.forEach((resource) => {
      const filePath = path.join(this.basePath, 'resources', resource.file);
      const exists = fs.existsSync(filePath);
      const status = exists ? '✅' : '❌';

      console.log(`   ${status} ${resource.name}`);
    });

    console.log('');
    console.log(this.colorize('💡 Tips:', 'magenta'));
    console.log('• Start with Lesson 0 if you\'re new to programming');
    console.log('• Each lesson includes practical assignments and projects');
    console.log('• Use the specialized guides for deep dives into specific topics');
    console.log('• Check resources for career guidance and additional examples');
    console.log('');
    console.log(this.colorize('🎯 Next Steps:', 'cyan'));
    console.log('1. Choose your starting point based on your experience level');
    console.log('2. Follow the learning path sequentially for best results');
    console.log('3. Practice with the code examples and assignments');
    console.log('4. Join our community for support and questions');
    console.log('');
  }

  displayStats() {
    const stats = this.getStats();

    console.log(this.colorize('📊 Repository Statistics:', 'green'));
    console.log(`Total Lessons: ${stats.totalLessons}`);
    console.log(`Total Guides: ${stats.totalGuides}`);
    console.log(`Total Resources: ${stats.totalResources}`);
    console.log(`Total Files: ${stats.totalFiles}`);
    console.log(`Estimated Learning Time: ${stats.estimatedHours} hours`);
    console.log('');
  }

  getStats() {
    const lessons = fs.readdirSync(path.join(this.basePath, 'lessons')).length;
    const guides = fs.readdirSync(path.join(this.basePath, 'guides')).length;
    const resources = fs.readdirSync(path.join(this.basePath, 'resources')).length;

    // Rough estimate: 4-8 hours per lesson, 2-4 hours per guide
    const estimatedHours = (lessons * 6) + (guides * 3) + (resources * 2);

    return {
      totalLessons: lessons,
      totalGuides: guides,
      totalResources: resources,
      totalFiles: lessons + guides + resources + 2, // + README and main guide
      estimatedHours
    };
  }

  run() {
    this.displayHeader();
    this.displayStats();
    this.displayMenu();

    console.log(this.colorize('Happy learning! 🚀', 'green'));
    console.log('');
  }
}

// Run the explorer
if (require.main === module) {
  const explorer = new GuideExplorer();
  explorer.run();
}

module.exports = GuideExplorer;