const questions = [
    {
        category: 'Laravel Backend',
        question: "Explain the request lifecycle in Laravel. How does a request go from the web server to your application and back to the user?",
        options: [
            "The request directly hits the controller, bypassing index.php and middleware.",
            "The request hits public/index.php, loads Composer, then the HTTP kernel handles it through global middleware, routing, controller processing, and finally sends the response back through middleware.",
            "Laravel processes requests by first authenticating the user, then routing, and finally applying global middleware.",
            "The web server directly executes the controller method without involving Laravel's index.php or kernel."
        ],
        correctAnswer: 1,
        explanation: "public/index.php boots the framework and the application; the HTTP Kernel registers global and route middleware; the router matches routes to controllers; controllers use services/models to build responses; responses travel back through middleware. Also mention service providers and the service container (DI) initialization."
    },
    {
        category: 'ORM',
        question: "What is ActiveRecord ORM and how does Eloquent implement it?",
        options: [
            "ActiveRecord is a design pattern where models map directly to database tables and include CRUD methods — Eloquent follows this pattern.",
            "ActiveRecord is a NoSQL database technique unrelated to Eloquent.",
            "ActiveRecord prevents using migrations and schema definitions in code.",
            "ActiveRecord is an architecture that always requires raw SQL for queries."
        ],
        correctAnswer: 0,
        explanation: "ActiveRecord couples an object with DB rows; Eloquent models represent tables and include methods like save(), update(), delete(). It simplifies CRUD and relationships but can be less efficient for very complex queries; in those cases use query builder or raw SQL."
    },
    {
        category: 'ORM',
        question: "What is eager loading and why is it important in Eloquent?",
        options: [
            "Eager loading loads related models in advance using with(), avoiding N+1 queries.",
            "Eager loading delays loading relations until they're accessed, causing extra queries.",
            "Eager loading is a frontend rendering technique.",
            "Eager loading automatically caches query results forever."
        ],
        correctAnswer: 0,
        explanation: "Eager loading fetches related records in the same or fewer queries (with(), withCount()). It prevents N+1 query issues and improves performance. Use it when you know you'll access relations."
    },
    {
        category: 'Laravel Backend',
        question: "How do you handle authentication and authorization in a Laravel application, especially for APIs?",
        options: [
            "Laravel uses session-based authentication for APIs and relies on manual checks for authorization.",
            "For API authentication, Laravel Sanctum is used for SPA or API token authentication. For authorization, Laravel's Gates and Policies provide granular control over user permissions.",
            "API authentication in Laravel is handled by JWT by default, and authorization is managed solely through database roles.",
            "Laravel APIs do not require explicit authentication or authorization as they are considered public by default."
        ],
        correctAnswer: 1,
        explanation: "Sanctum provides token-based and SPA auth; Passport for OAuth when needed. Use Gates for simple checks and Policies to group model-specific authorization. Always validate input and consider scopes/roles for APIs."
    },
    {
        category: 'Performance',
        question: "How would you optimize a slow-performing Laravel API endpoint?",
        options: [
            "Increase server RAM and CPU without profiling, as this always solves performance issues.",
            "Profile the endpoint, optimize database queries (N+1, indexing), implement caching, minimize resource consumption, make external calls asynchronous, review middleware, and offload tasks to queues.",
            "Remove all middleware and validation to speed up the endpoint, compromising security and data integrity.",
            "Switch to a different database system immediately, as the current database is always the bottleneck."
        ],
        correctAnswer: 1,
        explanation: "Start with profiling (Debugbar, Telescope, Blackfire). Fix N+1 via eager loading, add or refine indexes, cache heavy reads (Redis), queue long tasks, and paginate/stream large responses. Optimize only after identifying bottlenecks."
    },
    {
        category: 'Frontend',
        question: "Compare and contrast Vue.js and React. When would you choose one over the other?",
        options: [
            "Vue.js is a backend framework, while React is a frontend library.",
            "React uses JSX, strong ecosystem, flexible. Vue uses SFCs, traditional separation, easier learning curve. Choose React for large scale, flexibility; Vue for rapid dev, opinionated framework.",
            "React is known for its steep learning curve and lack of ecosystem, while Vue.js is complex but highly performant.",
            "Both Vue.js and React are identical in their approach and use cases; the choice is purely personal preference."
        ],
        correctAnswer: 1,
        explanation: "React excels for large apps with diverse ecosystems (Next.js, React Native). Vue offers clearer conventions, SFCs, and is easier to onboard. Choose based on team skill, performance needs, and ecosystem requirements."
    },
    {
        category: 'Frontend',
        question: "How do you manage state in a large React/Vue.js application?",
        options: [
            "State management in large applications is handled automatically by the framework; no explicit management is needed.",
            "In React, useState/useReducer for local, Context API or Redux/Zustand/Recoil for global. In Vue, data/ref/reactive for local, Pinia for global.",
            "All state should be managed in the root component and passed down via props to avoid complexity.",
            "State management is only relevant for backend applications, not frontend."
        ],
        correctAnswer: 1,
        explanation: "Use local state for UI bits, global stores for shared data. Prefer lightweight tools unless complexity demands heavier solutions. Use selectors/memoization to avoid unnecessary re-renders."
    },
    {
        category: 'Frontend',
        question: "What are the benefits of using Next.js over a traditional React SPA for a customer-facing website?",
        options: [
            "Next.js is only for mobile app development and has no benefits for web applications.",
            "Traditional React SPAs inherently have better SEO and initial load performance than Next.js.",
            "Next.js offers SSR/SSG for performance/SEO, automatic code splitting, file-system routing, API routes, image optimization, and TypeScript support.",
            "Next.js requires manual routing configuration and does not support API routes."
        ],
        correctAnswer: 2,
        explanation: "Next.js improves FCP and SEO through SSR/SSG, has image/font optimizations, and built-in routing and API routes — good for marketing/customer-facing sites. Use SSG/ISR for content that rarely changes."
    },
    {
        category: 'Database',
        question: "How do you ensure data integrity and optimize query performance in MySQL?",
        options: [
            "Data integrity is solely handled by the application layer, not the database.",
            "Data integrity: Foreign Keys, Constraints, Transactions, Proper Data Types. Query optimization: Indexing, EXPLAIN, avoiding SELECT *, Joins vs. Subqueries, Pagination, Caching.",
            "Optimizing queries means always using SELECT * and avoiding indexes to simplify development.",
            "MySQL automatically optimizes all queries; manual intervention is never required."
        ],
        correctAnswer: 1,
        explanation: "Normalize schema, then add indexes based on query patterns. Use EXPLAIN to inspect query plans, add transactions for multi-step writes, and use caching/denormalization selectively for read-heavy workloads."
    },
    {
        category: 'DevOps',
        question: "Describe your experience with CI/CD pipelines and how they contribute to software quality.",
        options: [
            "CI/CD is only for large enterprises and offers no benefits for smaller teams.",
            "CI/CD automates builds and tests (CI) and deploys validated code (CD). Improves quality by early bug detection, faster feedback, consistent deployments, better collaboration, and reduced risk.",
            "CI/CD pipelines primarily focus on manual testing and deployment processes.",
            "CI/CD increases the risk of bugs by automating deployments without proper human oversight."
        ],
        correctAnswer: 1,
        explanation: "A typical pipeline runs linters, unit/feature tests, builds artifacts, and deploys to staging; production deploys can be gated. Add monitoring, rollback strategies, and smoke tests to ensure reliability."
    },
    {
        category: 'Laravel Backend',
        question: "Explain the HTTP Kernel in Laravel and its role.",
        options: [
            "The HTTP Kernel is responsible for registering console commands only.",
            "The HTTP Kernel handles incoming HTTP requests, defines global and route middleware stacks, and coordinates request handling within the app.",
            "The HTTP Kernel stores database migrations.",
            "The HTTP Kernel is responsible for rendering frontend components."
        ],
        correctAnswer: 1,
        explanation: "The HTTP Kernel defines middleware priority and middleware groups, boots service providers, and orchestrates request handling. It's the central entry point for HTTP requests after public/index.php." 
    },
    {
        category: 'Laravel Security',
        question: "What are Gates in Laravel and when to use them?",
        options: [
            "Gates are routing helpers and unrelated to authorization.",
            "Gates are closures that determine if a user can perform a given action — use for simple, application-wide authorization checks.",
            "Gates replace middleware entirely.",
            "Gates are only for database seeding."
        ],
        correctAnswer: 1,
        explanation: "Use Gates for simple authorization logic (e.g., 'is admin?'). For model-specific permissions, prefer Policies which group logic per model."
    },
    {
        category: 'Laravel Security',
        question: "What are Policies in Laravel and how are they different from Gates?",
        options: [
            "Policies are class-based authorization handlers that group permissions for a model; Gates are closures for ad-hoc checks.",
            "Policies are only for database indexing.",
            "Policies are used to manage CSS styles in Laravel views.",
            "Policies and Gates are identical and interchangeable in all cases."
        ],
        correctAnswer: 0,
        explanation: "Policies organize authorization around models (e.g., PostPolicy). They map methods like view, create, update, delete. Use Gates for simple checks and Policies for model-centric rules."
    },
    {
        category: 'Testing - PHP',
        question: "Testing in PHP/Laravel: what are unit, feature, and integration tests and when to use them?",
        options: [
            "Unit tests verify isolated units (methods/classes). Feature tests simulate HTTP requests and app behavior. Integration tests check interactions between components (DB, external services).",
            "All tests in PHP are identical and called unit tests.",
            "Feature tests are only for frontend UI and not applicable in Laravel.",
            "Integration tests should be avoided in professional apps."
        ],
        correctAnswer: 0,
        explanation: "Unit: fast, isolated. Feature: test controllers/routes and middleware. Integration: involve DB, queues, or multiple services. Use PHPUnit and Laravel's testing helpers; mock external services and use in-memory DB or test databases where appropriate."
    },
    {
        category: 'Testing - Frontend',
        question: "Testing for Vue: what tools and strategies are common?",
        options: [
            "Only manual testing is available for Vue applications.",
            "Use Vue Test Utils for unit/component tests, Vitest/Jest as test runners, and Cypress for E2E tests. Test components, props, events, and store interactions.",
            "Vue has a built-in testing framework identical to PHPUnit.",
            "Testing Vue apps requires no mocks or stubs."
        ],
        correctAnswer: 1,
        explanation: "Unit test components with Vue Test Utils and a runner (Vitest/Jest), use Cypress/Playwright for E2E, and test store actions/mutations (Pinia/Vuex). Mock network requests and focus on user flows for E2E."
    },
    {
        category: 'Testing - Frontend',
        question: "Testing for React: what tools and strategies are common?",
        options: [
            "React apps cannot be automated tested.",
            "Use React Testing Library for component/unit tests, Jest/Vitest as runners, and Cypress/Playwright for E2E. Test rendering, user interactions, and state changes.",
            "Testing React requires only snapshot tests and nothing else.",
            "React tests should avoid mocking network calls."
        ],
        correctAnswer: 1,
        explanation: "React Testing Library encourages testing behavior over implementation. Use Jest/Vitest for fast unit tests and Cypress/Playwright for integration/E2E. Mock APIs and test accessibility/UX flows."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackElement = document.getElementById('feedback');
const explanationElement = document.getElementById('explanation');
const categoryElement = document.getElementById('category');
const resultsElement = document.getElementById('results');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const restartBtn = document.getElementById('restart-btn');

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    categoryElement.textContent = currentQuestion.category || '';
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = '';
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    explanationElement.innerHTML = '';
    submitBtn.style.display = 'block';
    submitBtn.disabled = true;
    nextBtn.style.display = 'none';
    selectedOption = null;

    currentQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option');
        optionDiv.textContent = option;
        optionDiv.dataset.index = index;
        optionDiv.addEventListener('click', () => selectOption(optionDiv, index));
        optionsElement.appendChild(optionDiv);
    });
}

function selectOption(optionDiv, index) {
    // Remove 'selected' from previously selected option
    const currentSelected = document.querySelector('.option.selected');
    if (currentSelected) {
        currentSelected.classList.remove('selected');
    }
    // Add 'selected' to the new option
    optionDiv.classList.add('selected');
    selectedOption = index;
    submitBtn.disabled = false; // Enable submit button once an option is selected
}

function checkAnswer() {
    if (selectedOption === null) {
        feedbackElement.textContent = 'Please select an answer.';
        feedbackElement.classList.add('incorrect');
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const optionDivs = optionsElement.querySelectorAll('.option');

    // Disable all options after submission
    optionDivs.forEach(div => div.style.pointerEvents = 'none');

    if (selectedOption === currentQuestion.correctAnswer) {
        score++;
        feedbackElement.textContent = 'Correct!';
        feedbackElement.classList.add('correct');
        optionDivs[selectedOption].classList.add('correct');
    } else {
        feedbackElement.textContent = 'Incorrect. The correct answer was: ' + currentQuestion.options[currentQuestion.correctAnswer];
        feedbackElement.classList.add('incorrect');
        optionDivs[selectedOption].classList.add('incorrect');
        optionDivs[currentQuestion.correctAnswer].classList.add('correct'); // Highlight correct answer
    }

    // Show detailed explanation
    if (currentQuestion.explanation) {
        explanationElement.innerHTML = '<strong>Explanation:</strong> ' + currentQuestion.explanation;
    }

    submitBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    nextBtn.disabled = false;
}

function showResults() {
    document.getElementById('quiz').style.display = 'none';
    resultsElement.style.display = 'block';
    scoreElement.textContent = score;
    totalQuestionsElement.textContent = questions.length;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('quiz').style.display = 'block';
    resultsElement.style.display = 'none';
    loadQuestion();
}

// Event Listeners
submitBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Initial load
loadQuestion();
submitBtn.disabled = true; // Disable submit button initially
